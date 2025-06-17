import { useEffect, useState } from "react"
import "./style.css"
import TextWriting from "../TextWriting"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import FadeText from "../FadeText"
import HideText from "../HideText"

export default function TechCard({ item }) {
  const controls = useAnimation()
  const [ref, inView] = useInView()
  const [hasAnimated, setHasAnimated] = useState(false)
  const delay = 0

  const handleComplete = () => {
    setHasAnimated(true)
  }

  useEffect(() => {
    if (inView && !hasAnimated) {
      controls.start("visible")
    }
  }, [inView, controls])

  const opacityVariants = {
    hidden: { opacity: 0, mixBlendMode: "color-dodge" },
    visible: { opacity: 1, mixBlendMode: "normal" },
  }

  return (
    <div ref={ref} className="project__wrapper">
      <motion.img
        src={item.img}
        alt=""
        className="project__img"
        initial="hidden"
        animate={controls}
        variants={opacityVariants}
        transition={{ duration: 2, delay: 0.5 }}
        onAnimationComplete={handleComplete}
      />

      <div className="project__wrapper--bg"></div>

      <div className="project__description">
        <h3 className="project__description--title">
          <TextWriting
            delay={delay}
            nocursor
            controls={controls}
            stagger={0.08}
            text={item.title}
          />
        </h3>

        

        <p className="project__description--para">
          <FadeText controls={controls} delay={delay}>
            {item.detail}
          </FadeText>
        </p>
      </div>
    </div>
  )
}
