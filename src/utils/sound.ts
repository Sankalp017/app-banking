export const playNotificationSound = () => {
  if (typeof window === "undefined") return;

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  if (!audioContext) {
    console.warn("Browser does not support Web Audio API");
    return;
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'sine';
  // Even lower frequency for a more subtle tone
  oscillator.frequency.setValueAtTime(380, audioContext.currentTime);

  // Lower volume and a quicker fade for subtlety
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.02); // Quick fade in
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);   // Fade out over the remaining duration

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.2);
};