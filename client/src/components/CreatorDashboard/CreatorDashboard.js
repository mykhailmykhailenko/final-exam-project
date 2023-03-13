import React, {useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import {
  getContestsForCreative,
  clearContestList,
  setNewCreatorFilter,
  getDataForContest,
} from '../../actions/actionCreator';
import ContestsContainer from '../ContestsContainer/ContestsContainer';
import ContestBox from '../ContestBox/ContestBox';
import styles from './CreatorDashboard.module.sass';
import TryAgain from '../TryAgain/TryAgain';

const types = ['', 'name,tagline,logo', 'name', 'tagline', 'logo', 'name,tagline', 'logo,tagline', 'name,logo'];

const CreatorDashboard = (props) => {
    
    const renderSelectType = () => {
        const array = [];
        const { creatorFilter } = props;
        types.forEach((el, i) => !i || array.push(<option key={i - 1} value={el}>{el}</option>));
        return (
          <select
            onChange={({ target }) => changePredicate({
              name: 'typeIndex',
              value: types.indexOf(target.value),
            })}
            value={types[creatorFilter.typeIndex]}
            className={styles.input}
          >
            {array}
          </select>
        );
    };

    const renderIndustryType = () => {
      const array = [];
      const { creatorFilter } = props;
      const { industry } = props.dataForContest.data;
      array.push(<option key={0} value={null}>Choose industry</option>);
      industry.forEach((industry, i) => array.push(<option key={i + 1} value={industry}>{industry}</option>));
      return (
        <select
          onChange={({ target }) => changePredicate({
            name: 'industry',
            value: target.value,
          })}
          value={creatorFilter.industry}
          className={styles.input}
        >
          {array}
        </select>
      );
    };

    useEffect((nextProps, nextContext)=>{
      if (nextProps.location.search !== props.location.search) {
        parseUrlForParams(nextProps.location.search);
      }
    }, [props.location.search]);

    useEffect(() => {
        getDataForContest();
        if (parseUrlForParams(props.location.search) && !props.contests.length) {
          getContests(props.creatorFilter);
        }
    }, [])

    const getContests = (filter) => {
      props.getContests({
        limit: 8,
        offset: 0,
        ...filter,
      });
    };

    const changePredicate = ({ name, value }) => {
      const { creatorFilter } = props;
      props.newFilter({ [name]: value === 'Choose industry' ? null : value });
      parseParamsToUrl({ ...creatorFilter, ...{ [name]: value === 'Choose industry' ? null : value } });
    };

    const parseParamsToUrl = (creatorFilter) => {
      const obj = {};
      Object.keys(creatorFilter).forEach((el) => {
        if (creatorFilter[el]) obj[el] = creatorFilter[el];
      });
      props.history.push(`/Dashboard?${queryString.stringify(obj)}`);
    };

    const parseUrlForParams = (search) => {
      const obj = queryString.parse(search);
      const filter = {
        typeIndex: obj.typeIndex || 1,
        contestId: obj.contestId ? obj.contestId : '',
        industry: obj.industry ? obj.industry : '',
        awardSort: obj.awardSort || 'asc',
        ownEntries: typeof obj.ownEntries === 'undefined' ? false : obj.ownEntries,
      };
      if (!isEqual(filter, props.creatorFilter)) {
        props.newFilter(filter);
        props.clearContestsList();
        getContests(filter);
        return false;
      } return true;
    };

    const getPredicateOfRequest = () => {
      const obj = {};
      const { creatorFilter } = props;
      Object.keys(creatorFilter).forEach((el) => {
        if (creatorFilter[el]) {
          obj[el] = creatorFilter[el];
        }
      });
      obj.ownEntries = creatorFilter.ownEntries;
      return obj;
    };

    const loadMore = (startFrom) => {
      props.getContests({
        limit: 8,
        offset: startFrom,
        ...getPredicateOfRequest(),
      });
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

    const goToExtended = (contestId) => {
      props.history.push(`/contest/${contestId}`);
    };

    const tryLoadAgain = () => {
      props.clearContestsList();
      props.getContests({ limit: 8, offset: 0, ...getPredicateOfRequest() });
    };

      const { error, haveMore, creatorFilter } = props;
      const { isFetching } = props.dataForContest;
      return (
        <div className={styles.mainContainer}>
          <div className={styles.filterContainer}>
            <span className={styles.headerFilter}>Filter Results</span>
            <div className={styles.inputsContainer}>
              <div
                onClick={() => changePredicate({ name: 'ownEntries', value: !creatorFilter.ownEntries })}
                className={classNames(styles.myEntries, { [styles.activeMyEntries]: creatorFilter.ownEntries })}
              >
                My
                Entries
              </div>
              <div className={styles.inputContainer}>
                <span>By contest type</span>
                {renderSelectType()}
              </div>
              <div className={styles.inputContainer}>
                <span>By contest ID</span>
                <input
                  type="text"
                  onChange={({ target }) => changePredicate({
                    name: 'contestId',
                    value: target.value,
                  })}
                  name="contestId"
                  value={creatorFilter.contestId}
                  className={styles.input}
                />
              </div>
              {!isFetching && (
              <div className={styles.inputContainer}>
                <span>By industry</span>
                {renderIndustryType()}
              </div>
              )}
              <div className={styles.inputContainer}>
                <span>By amount award</span>
                <select
                  onChange={({ target }) => changePredicate({
                    name: 'awardSort',
                    value: target.value,
                  })}
                  value={creatorFilter.awardSort}
                  className={styles.input}
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>
          {
                    error
                      ? (
                        <div className={styles.messageContainer}>
                          <TryAgain getData={tryLoadAgain} />
                        </div>
                      )
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
      );
    
}

const mapStateToProps = (state) => {
  const { contestsList, dataForContest } = state;
  return { ...contestsList, dataForContest };
};

const mapDispatchToProps = (dispatch) => ({
  getContests: (data) => dispatch(getContestsForCreative(data)),
  clearContestsList: () => dispatch(clearContestList()),
  newFilter: (filter) => dispatch(setNewCreatorFilter(filter)),
  getDataForContest: () => dispatch(getDataForContest()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreatorDashboard));
