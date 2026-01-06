import { useEffect, useRef, useState } from 'react'

const ProgressiveImage = ({
  src,
  alt,
  placeholderSrc,
  className = '',
  imgClassName = '',
  onLoad,
  onError,
  eager = false
}) => {
  const containerRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (eager) {
      setVisible(true)
      return
    }
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [eager])

  const handleLoad = e => {
    setLoaded(true)
    onLoad && onLoad(e)
  }

  const handleError = e => {
    setFailed(true)
    onError && onError(e)
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      aria-busy={!loaded && !failed}
      aria-live="polite"
      role="group"
    >
      {!loaded && !failed && (
        <div className="absolute inset-0 skeleton" aria-hidden="true" />
      )}

      {placeholderSrc && !loaded && !failed && (
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-md scale-[1.02] opacity-70 transition-opacity duration-300"
          decoding="async"
        />
      )}

      {visible && !failed && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        />
      )}

      {failed && (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500 text-sm">
          Image failed to load
        </div>
      )}
    </div>
  )
}

export default ProgressiveImage
