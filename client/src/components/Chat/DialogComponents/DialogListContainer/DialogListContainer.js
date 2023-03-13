import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { getPreviewChat } from '../../../../actions/actionCreator';
import DialogList from '../DialogList/DialogList';

const DialogListContainer = (props) => {
  
  useEffect(() => {
    props.getChatPreview();
  }, [])
  
    const { messagesPreview, userId } = props;
    return <DialogList preview={messagesPreview} userId={userId} />;
  
}

const mapStateToProps = (state) => state.chatStore;

const mapDispatchToProps = (dispatch) => ({
  getChatPreview: () => dispatch(getPreviewChat()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DialogListContainer);
