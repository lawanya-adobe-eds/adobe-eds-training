/**
 * Hero block.
 * The default (image) hero is auto-blocked and styled via CSS only.
 * This decorator adds the `video-background` variant: a muted, looping,
 * autoplaying background video with a poster-image fallback (also used
 * when the user prefers reduced motion or the video cannot load).
 * @param {Element} block The block element
 */
export default function decorate(block) {
  if (!block.classList.contains('video-background')) return;

  // find the video source: an <a> pointing at a video file
  const videoLink = [...block.querySelectorAll('a')]
    .find((a) => /\.(mp4|webm|mov)(\?.*)?$/i.test(a.href));
  if (!videoLink) return;

  // poster: an authored picture/image in the block, if any
  const posterImg = block.querySelector('img');
  const posterSrc = posterImg ? posterImg.getAttribute('src') : '';

  const wrapper = document.createElement('div');
  wrapper.className = 'hero-video';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion && posterSrc) {
    // reduced motion: show the poster image only, no autoplay
    const img = document.createElement('img');
    img.src = posterSrc;
    img.alt = '';
    img.loading = 'eager';
    wrapper.append(img);
  } else {
    const video = document.createElement('video');
    video.muted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('preload', 'metadata');
    video.setAttribute('aria-hidden', 'true');
    if (posterSrc) video.poster = posterSrc;
    const source = document.createElement('source');
    source.src = videoLink.href;
    const ext = (videoLink.href.split('.').pop() || 'mp4').replace(/\?.*$/, '');
    source.type = `video/${ext}`;
    video.append(source);
    wrapper.append(video);
  }

  // remove the authored media link (and its wrapper) and the poster placeholder
  const linkWrapper = videoLink.closest('p') || videoLink;
  linkWrapper.remove();
  const posterPic = block.querySelector('picture');
  if (posterPic) {
    const picWrapper = posterPic.closest('p') || posterPic;
    picWrapper.remove();
  }

  block.prepend(wrapper);
}
