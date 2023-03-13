import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { getContestsForCustomer, clearContestList, setNewCustomerFilter } from '../../actions/actionCreator';
import CONSTANTS from '../../constants';
import ContestsContainer from '../ContestsContainer/ContestsContainer';
import ContestBox from '../ContestBox/ContestBox';
import styles from './CustomerDashboard.module.sass';
import TryAgain from '../TryAgain/TryAgain';

const CustomerDashboard = (props) => {
    
    const loadMore = (startFrom) => {
      props.getContests({
        limit: 8,
        offset: startFrom,
        contestStatus: props.customerFilter,
      });
    };

    useEffect(() => {
      getContests();
      return () => {
        props.clearContestsList();
      }
    }, [])

    useEffect ((prevProps, prevState, snapshot) => {
      if (props.customerFilter !== prevProps.customerFilter) {
        getContests();
      }
    }, [props.customerFilter])

    const getContests = () => {
      props.getContests({ limit: 8, contestStatus: props.customerFilter });
    };

    const goToExtended = (contest_id) => {
      props.history.push(`/contest/${contest_id}`);
    };

    const setContestList = () => {
      const array = [];
      const { contests } = props;
      for (let i = 0; i < contests.length; i++) {
        array.push(<ContestBox
          data={contests[i]}
          key={contests[i].id}
          goToExtended={goToExtended}
        />);
      }
      return array;
    };

    

    const tryToGetContest = () => {
      props.clearContestsList();
      getContests();
    };

   
      const { error, haveMore } = props;
      const { customerFilter } = props;
      return (
        <div className={styles.mainContainer}>
          <div className={styles.filterContainer}>
            <div
              onClick={() => props.newFilter(CONSTANTS.CONTEST_STATUS_ACTIVE)}
              className={classNames({
                [styles.activeFilter]: CONSTANTS.CONTEST_STATUS_ACTIVE === customerFilter,
                [styles.filter]: CONSTANTS.CONTEST_STATUS_ACTIVE !== customerFilter,
              })}
            >
              Active Contests
            </div>
            <div
              onClick={() => props.newFilter(CONSTANTS.CONTEST_STATUS_FINISHED)}
              className={classNames({
                [styles.activeFilter]: CONSTANTS.CONTEST_STATUS_FINISHED === customerFilter,
                [styles.filter]: CONSTANTS.CONTEST_STATUS_FINISHED !== customerFilter,
              })}
            >
              Completed contests
            </div>
            <div
              onClick={() => props.newFilter(CONSTANTS.CONTEST_STATUS_PENDING)}
              className={classNames({
                [styles.activeFilter]: CONSTANTS.CONTEST_STATUS_PENDING === customerFilter,
                [styles.filter]: CONSTANTS.CONTEST_STATUS_PENDING !== customerFilter,
              })}
            >
              Inactive contests
            </div>
          </div>
          <div className={styles.contestsContainer}>
            {
                        error
                          ? <TryAgain getData={tryToGetContest()} />
                          : (
                            <ContestsContainer
                              isFetching={props.isFetching}
                              loadMore={loadMore}
                              history={props.history}
                              haveMore={haveMore}
                            >
                              {setContestList()}
                            </ContestsContainer>
                          )
                    }
          </div>
        </div>

      );
    
}

const mapStateToProps = (state) => state.contestsList;

const mapDispatchToProps = (dispatch) => ({
  getContests: (data) => dispatch(getContestsForCustomer(data)),
  clearContestsList: () => dispatch(clearContestList()),
  newFilter: (filter) => dispatch(setNewCustomerFilter(filter)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDashboard);
