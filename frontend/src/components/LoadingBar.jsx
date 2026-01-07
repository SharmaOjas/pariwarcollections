import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContextBase'

const LoadingBar = () => {
  const { isLoading } = useContext(ShopContext)
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isLoading) {
      setVisible(true)
      setProgress(20)
      const timer = setInterval(() => {
        setProgress(p => Math.min(95, p + Math.random() * 10))
      }, 200)
      return () => clearInterval(timer)
    } else {
      // finish and hide
      setProgress(100)
      const t = setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 300)
      return () => clearTimeout(t)
    }
  }, [isLoading])

  if (!visible) return null

  return (
    <div
      aria-live="polite"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      className="fixed top-0 left-0 right-0 z-[1000]"
    >
      <div className="h-1 bg-[#EDC483]/40 w-full">
        <div
          className="h-1 bg-[#53131f] transition-[width] duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="pointer-events-none fixed top-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#53131f]/30 to-transparent blur-[2px]" />
    </div>
  )
}

export default LoadingBar
