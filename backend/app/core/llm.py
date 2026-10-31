"""Universal LLM Client supporting Grok (xAI), Google Gemini, and OpenAI."""
from typing import Optional, Dict, Any, List
import httpx
from app.core.config import settings
from app.core.logging import logger


class LLMClient:
    """Unified client for invoking Grok (xAI), Gemini, or OpenAI."""

    def __init__(
        self,
        provider: Optional[str] = None,
        model: Optional[str] = None,
        api_key: Optional[str] = None,
    ):
        self.provider = (provider or settings.LLM_PROVIDER).lower()
        self.model = model or settings.DEFAULT_MODEL
        self._custom_key = api_key

    @property
    def api_key(self) -> Optional[str]:
        if self._custom_key:
            return self._custom_key
        if self.provider == "grok" or "grok" in self.model.lower():
            return settings.GROK_API_KEY or settings.XAI_API_KEY
        elif self.provider == "gemini":
            return settings.GEMINI_API_KEY
        elif self.provider == "openai":
            return settings.OPENAI_API_KEY
        # Fallback to any available key
        return (
            settings.GROK_API_KEY
            or settings.XAI_API_KEY
            or settings.GEMINI_API_KEY
            or settings.OPENAI_API_KEY
        )

    def is_configured(self) -> bool:
        """Returns True if an API key is available for the active provider."""
        key = self.api_key
        return bool(key and key.strip() and not key.startswith("your_"))

    async def generate(
        self,
        prompt: str,
        temperature: float = 0.1,
        max_tokens: int = 2048,
        system_prompt: Optional[str] = None,
        timeout: float = 45.0,
    ) -> Optional[str]:
        """Generate text using the configured LLM provider."""
        if not self.is_configured():
            return None

        # Auto-route to Grok if model is grok or provider is grok
        active_provider = self.provider
        if "grok" in self.model.lower() or active_provider == "grok":
            return await self._call_grok(prompt, temperature, max_tokens, system_prompt, timeout)
        elif active_provider == "gemini":
            return await self._call_gemini(prompt, temperature, max_tokens, timeout)
        elif active_provider == "openai":
            return await self._call_openai(prompt, temperature, max_tokens, system_prompt, timeout)
        else:
            return await self._call_grok(prompt, temperature, max_tokens, system_prompt, timeout)

    async def _call_grok(
        self,
        prompt: str,
        temperature: float,
        max_tokens: int,
        system_prompt: Optional[str],
        timeout: float,
    ) -> Optional[str]:
        """Call xAI Grok API (OpenAI-compatible chat completions)."""
        key = self.api_key
        if not key:
            return None

        model = self.model
        if "gemini" in model.lower():
            model = "grok-2-latest"

        messages: List[Dict[str, str]] = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        url = "https://api.x.ai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }

        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                resp = await client.post(url, headers=headers, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    choices = data.get("choices", [])
                    if choices:
                        content = choices[0].get("message", {}).get("content", "")
                        logger.info(f"Grok ({model}) successfully generated response ({len(content)} chars)")
                        return content
                else:
                    logger.warning(f"Grok API error HTTP {resp.status_code}: {resp.text[:200]}")
        except Exception as e:
            logger.warning(f"Grok API call failed: {e}")
        return None

    async def _call_gemini(
        self,
        prompt: str,
        temperature: float,
        max_tokens: int,
        timeout: float,
    ) -> Optional[str]:
        """Call Google Gemini API."""
        key = self.api_key
        if not key:
            return None

        model = self.model
        if "grok" in model.lower():
            model = "gemini-3.8-flash"

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": temperature, "maxOutputTokens": max_tokens},
        }

        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                resp = await client.post(url, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    content = (
                        data.get("candidates", [{}])[0]
                        .get("content", {})
                        .get("parts", [{}])[0]
                        .get("text", "")
                    )
                    return content
                else:
                    logger.warning(f"Gemini API error HTTP {resp.status_code}: {resp.text[:200]}")
        except Exception as e:
            logger.warning(f"Gemini API call failed: {e}")
        return None

    async def _call_openai(
        self,
        prompt: str,
        temperature: float,
        max_tokens: int,
        system_prompt: Optional[str],
        timeout: float,
    ) -> Optional[str]:
        """Call OpenAI API."""
        key = self.api_key
        if not key:
            return None

        messages: List[Dict[str, str]] = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }

        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                resp = await client.post(url, headers=headers, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    choices = data.get("choices", [])
                    if choices:
                        return choices[0].get("message", {}).get("content", "")
                else:
                    logger.warning(f"OpenAI API error HTTP {resp.status_code}: {resp.text[:200]}")
        except Exception as e:
            logger.warning(f"OpenAI API call failed: {e}")
        return None


# Global singleton instance
llm_client = LLMClient()
