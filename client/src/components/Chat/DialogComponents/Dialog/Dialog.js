import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import className from 'classnames';
import { getDialogMessages, clearMessageList } from '../../../../actions/actionCreator';
import ChatHeader from '../../ChatComponents/ChatHeader/ChatHeader';
import styles from './Dialog.module.sass';
import ChatInput from '../../ChatComponents/ChatInut/ChatInput';

const Dialog = (props) => {
  const messagesEnd = React.createRef();

    useEffect(() => {
      props.getDialog({ interlocutorId: props.interlocutor.id });
      scrollToBottom();
      return () => {
        props.clearMessageList();
      }
    }, [])

    useEffect((nextProps, nextContext) => {
      if (nextProps.interlocutor.id !== props.interlocutor.id) {
      props.getDialog({ interlocutorId: nextProps.interlocutor.id });
      }
    }, [props.interlocutor.id])

    useEffect(() => {
      if (messagesEnd.current) {
        scrollToBottom();
      } 
    }, [messagesEnd.current])

    

    const scrollToBottom = () => {
      messagesEnd.current.scrollIntoView({ behavior: 'smooth' });
    };

    const renderMainDialog = () => {
      const messagesArray = [];
      const { messages, userId } = props;
      let currentTime = moment();
      messages.forEach((message, i) => {
        if (!currentTime.isSame(message.createdAt, 'date')) {
          messagesArray.push(
            <div key={message.createdAt} className={styles.date}>
              {moment(message.createdAt).format('MMMM DD, YYYY')}
            </div>,
          );
          currentTime = moment(message.createdAt);
        }
        messagesArray.push(
          <div
            key={i}
            className={className(userId === message.sender ? styles.ownMessage : styles.message)}
          >
            <span>{message.body}</span>
            <span className={styles.messageTime}>{moment(message.createdAt).format('HH:mm')}</span>
            <div ref={messagesEnd} />
          </div>,
        );
      });
      return (
        <div className={styles.messageList}>
          {messagesArray}
        </div>
      );
    };

    const blockMessage = () => {
      const { userId, chatData } = props;
      const { blackList, participants } = chatData;
      const userIndex = participants.indexOf(userId);
      let message;
      if (chatData && blackList[userIndex]) {
        message = 'You block him';
      } else if (chatData && blackList.includes(true)) {
        message = 'He block you';
      }
      return (
        <span className={styles.messageBlock}>{message}</span>
      );
    };

    
      const { chatData, userId } = props;
      return (
        <>
          <ChatHeader userId={userId} />
          {renderMainDialog()}
          <div ref={messagesEnd} />
          {(chatData && chatData.blackList.includes(true)) ? 
          blockMessage() : <ChatInput />}
        </>
      );
    
}

const mapStateToProps = (state) => state.chatStore;

const mapDispatchToProps = (dispatch) => ({
  getDialog: (data) => dispatch(getDialogMessages(data)),
  clearMessageList: () => dispatch(clearMessageList()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dialog);
