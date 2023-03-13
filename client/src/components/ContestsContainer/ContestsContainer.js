import React, {useCallback, useEffect} from 'react';
import styles from './ContestContainer.module.sass';
import Spinner from '../Spinner/Spinner';

const ContestsContainer = (props) => {
    const scrollHandler = useCallback (() => {
      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        if (props.haveMore) {
          props.loadMore(props.children.length);
        }
      }
    }, [props]);

    useEffect(()=>{
      window.addEventListener('scroll', scrollHandler);
      return () => {
      window.removeEventListener('scroll', scrollHandler);
      }
    },[scrollHandler]);

    const { isFetching } = props;
    if (!isFetching && props.children.length === 0) {
      return <div className={styles.notFound}>Nothing not found</div>;
    } 

    return (
      <div>
        {props.children}
        {isFetching && <div className={styles.spinnerContainer}><Spinner /></div>}
      </div>
    )
      
    
}

export default ContestsContainer;
