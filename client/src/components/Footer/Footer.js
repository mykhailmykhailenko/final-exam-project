import React from 'react';
import styles from './Footer.module.sass';
import CONSTANTS from '../../constants';

const Footer = (props) => {
    const topFooterItemsRender = (item) => (
      <div key={item.title}>
        <h4>{item.title}</h4>
        {item.items.map((i) => <a key={i} href="!#">{i}</a>)}
      </div>
    );

    const topFooterRender = () => {
      return CONSTANTS.FooterItems.map((item) => topFooterItemsRender(item));
    }

      return (
        <div className={styles.footerContainer}>
          <div className={styles.footerTop}>
            <div>
              {topFooterRender()}
            </div>
          </div>
        </div>
      );
    
}

export default Footer;
