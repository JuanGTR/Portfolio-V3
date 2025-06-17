import { useState, useEffect } from "react"
import "./style.css"
import BackgroundLines from "../BackgroundLines"
import ParaWriting from "../ParaWriting"
import { motion, useAnimation } from "framer-motion"
import ArrowUpRightIcon from "../../assets/Icon/arrow-up-right.svg"
import { useInView } from "react-intersection-observer"
import Button from "../Button"
import Time from "../Time"

import emailjs from "@emailjs/browser"

import emailjsconfig from "../../constants/emailjs.json"
import Alert from "../Alert"

export default function Footer() {
  const controls = useAnimation()
  const [ref, inView] = useInView()
  const [isSending, setIsSending] = useState(false)
  const [sendStatus, setSendStatus] = useState({ processed: false, message: "", variant: "success" })
  const [hasAnimated, setHasAnimated] = useState(false)

  const [formData, setFormData] = useState({
    user_name: '', // Initialized with new keys
    user_email: '', // Initialized with new keys
    message: '',
  });

  const [fieldValues, setFieldValues] = useState({
    user_name: false, // Initialized with new keys
    user_email: false, // Initialized with new keys
    message: false,
  });

  const handleComplete = () => {
    setHasAnimated(true)
  }

  useEffect(() => {
    if (inView && !hasAnimated) {
      controls.start("visible")
    }
  }, [inView, controls])

  const opacityVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const inputFieldLineVariant = {
    hidden: { width: "0%" },
    visible: {
      width: "100%",
    },
  }

  const inputFields = [
    {
      label: "Name",
      type: "text",
      id: "name",
      placeholder: "Enter name",
      stateKey: "user_name", // THIS WAS CHANGED
    },
    {
      label: "Email",
      type: "email",
      id: "email",
      placeholder: "hello@mail.com",
      stateKey: "user_email", // THIS WAS CHANGED
    },
    {
      label: "Message",
      type: "textarea",
      id: "message",
      placeholder: "Your message",
      rows: "8",
      wrap: "soft",
      stateKey: "message",
    },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
    setFieldValues(prevFieldValues => ({
        ...prevFieldValues,
        [name]: true
    }));
  };

  const timeoutAlert = () =>
    setTimeout(() => {
      setSendStatus({ ...sendStatus, processed: false })
    }, 5000)

  const sendEmail = async () => {
    // *** IMPORTANT CHANGE HERE: Update requiredFields to match new stateKeys ***
    const requiredFields = ["user_name", "user_email", "message"]
    const missingFields = requiredFields.filter((field) => !formData[field])

    if (missingFields.length > 0) {
      setSendStatus({ processed: true, variant: "error", message: "Not all fields were filled" })
      timeoutAlert()
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    // *** IMPORTANT CHANGE HERE: Use formData.user_email for validation ***
    if (!emailRegex.test(formData.user_email)) {
      setSendStatus({ processed: true, variant: "error", message: "Invalid email" })
      timeoutAlert()
      return
    }

    setIsSending(true)
    try {
      const { serviceId, templateid, publicKey } = emailjsconfig

      console.log("Sending email with:", {
        serviceId,
        templateid,
        publicKey,
        templateParams: formData
      });

      // formData now correctly contains user_name, user_email, and message
      const response = await emailjs.send(serviceId, templateid, formData, publicKey)

      console.log("Email sent successfully:", response)
      setIsSending(false)
      setSendStatus({ processed: true, variant: "success", message: "Success!" })
      
      // Reset form data after successful send
      setFormData({
        user_name: '',
        user_email: '',
        message: '',
      });
      // Reset fieldValues for animation (if applicable)
      setFieldValues({
        user_name: false,
        user_email: false,
        message: false,
      });

    } catch (error) {
      console.error("Error sending email:", error)
      setIsSending(false)
      setSendStatus({ processed: true, variant: "error", message: "Error" })
    }

    timeoutAlert()
  }

  return (
    <footer ref={ref} className="footer" id="contact">
      <BackgroundLines />

      <div className="footer--grid">
        <div className="footer--grid--heading">
          <h2>
            <ParaWriting stagger={0.08} text={"Get in "} sec={"touch"} />
          </h2>
        </div>
        <div className="footer--grid--form">
          {inputFields.map((field, index) => (
            <motion.div key={index} initial="hidden" animate={controls} variants={opacityVariant} transition={{ duration: 1, delay: 0.5 * (index + 1) }} className="input--div">
              <label htmlFor={field.id}>{field.label}</label>
              {field.type === "textarea" ?
                <textarea
                  name={field.stateKey}
                  id={field.id}
                  placeholder={field.placeholder}
                  rows={field.rows}
                  wrap={field.wrap}
                  value={formData[field.stateKey]}
                  onChange={handleChange}
                  onFocus={() => setFieldValues(prev => ({...prev, [field.stateKey]: true}))}
                  onBlur={() => setFieldValues(prev => ({...prev, [field.stateKey]: false}))}
                ></textarea> :
                <input
                  type={field.type}
                  name={field.stateKey}
                  id={field.id}
                  placeholder={field.placeholder}
                  value={formData[field.stateKey]}
                  onChange={handleChange}
                  onFocus={() => setFieldValues(prev => ({...prev, [field.stateKey]: true}))}
                  onBlur={() => setFieldValues(prev => ({...prev, [field.stateKey]: false}))}
                />
              }
              <motion.div
                initial="hidden"
                animate={controls}
                variants={inputFieldLineVariant}
                transition={{
                  type: "spring",
                  stiffness: 20,
                  duration: 1,
                  delay: 0.5 * (index + 1),
                }}
                className="input--div--line"
              >
                <motion.div
                  initial="hidden"
                  animate={fieldValues[field.stateKey] && "visible"}
                  variants={inputFieldLineVariant}
                  transition={{
                    type: "spring",
                    stiffness: 20,
                    duration: 1,
                  }}
                ></motion.div>
              </motion.div>
            </motion.div>
          ))}
          <motion.div initial="hidden" animate={controls} variants={opacityVariant} transition={{ duration: 1, delay: 2 }} className="footer--grid--form--btn">
            <Button label={`${isSending ? "Sending it through" : "SEND MESSAGE"}`} icon={ArrowUpRightIcon} onClick={sendEmail} />
          </motion.div>
        </div>
      </div>

      <motion.div initial="hidden" animate={controls} variants={opacityVariant} transition={{ duration: 1, delay: 2.5 }} className="footer--bottom" onAnimationComplete={() => handleComplete()}>
        <p>Copyright © {new Date().getFullYear()} Juan Tejeda</p>
        <p>
          <Time delay={3} />
        </p>
        <p></p>
      </motion.div>
      <Alert isVisible={sendStatus.processed} text={sendStatus.message} variant={sendStatus.variant} />
    </footer>
  )
}