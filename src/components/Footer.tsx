import React from 'react'
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <div className={styles.footerContainer}>
      <h1 className={styles.footerText}><a href="https://www.linkedin.com/in/mark-mason-701ba01b0/">Made By Mark Mason</a></h1>
      <img className={styles.linkedinImg} src="/images/linkedin-sign.webp" alt="" onClick={()=>{
        window.open("https://www.linkedin.com/in/mark-mason-701ba01b0/")
      }}/>
     
    </div>
  )
}

export default Footer