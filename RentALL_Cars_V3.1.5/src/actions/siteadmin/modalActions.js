import {
  OPEN_LIST_SETTINGS_MODAL,
  CLOSE_LIST_SETTINGS_MODAL,
  OPEN_ADMIN_ROLES_MODAL,
  CLOSE_ADMIN_ROLES_MODAL,
  OPEN_ADMIN_USER_MODAL,
  CLOSE_ADMIN_USER_MODAL
} from '../../constants';
import { initialize } from 'redux-form';

const openListSettingsModal = (initialData, formName) => {
  return (dispatch, getState) => {

    // Reinitialize the form values
    dispatch(initialize(formName, initialData, true));
    dispatch({
      type: OPEN_LIST_SETTINGS_MODAL,
      listSettingsModal: true,
    });

  };
}

const openEditListSettingsModal = (initialData) => {
  return (dispatch, getState) => {

    // Reinitialize the form values
    dispatch(initialize("EditListSettingsForm", initialData, true));
    dispatch({
      type: OPEN_LIST_SETTINGS_MODAL,
      listSettingsModal: true,

    });
  };
}

const closeListSettingsModal = () => {
  return (dispatch, getState) => {
    dispatch({
      type: CLOSE_LIST_SETTINGS_MODAL,
      listSettingsModal: false
    });
  };
}


const openAdminRolesModal = (type, formData) => {
  return (dispatch, getState) => {
    if (type === 'edit') {
      dispatch(initialize("AdminRolesForm", formData, true));
    }

    dispatch({
      type: OPEN_ADMIN_ROLES_MODAL,
      payload: {
        adminRolesModal: true,
        adminRolesModalType: type
      }
    });
  }
}

const closeAdminRolesModal = () => {
  return (dispatch, getState) => {
    dispatch({
      type: CLOSE_ADMIN_ROLES_MODAL,
      payload: {
        adminRolesModal: false
      }
    });
  }
}

const openAdminUserModal = (type, formData) => {
  return (dispatch, getState) => {
    if (type === 'edit') {
      dispatch(initialize("AdminUserForm", formData, true));
    }

    dispatch({
      type: OPEN_ADMIN_USER_MODAL,
      payload: {
        adminUserModal: true,
        adminUserModalType: type
      }
    });
  }
}

const closeAdminUserModal = () => {
  return (dispatch, getState) => {
    dispatch({
      type: CLOSE_ADMIN_USER_MODAL,
      payload: {
        adminUserModal: false
      }
    });
  }
}

export {
  openListSettingsModal, openEditListSettingsModal, closeListSettingsModal,
  openAdminRolesModal, closeAdminRolesModal, openAdminUserModal, closeAdminUserModal
};