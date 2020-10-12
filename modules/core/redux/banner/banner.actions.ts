import BannerActionTypes from "./banner.types";

export const closeBanner = () => ({
    type: BannerActionTypes.CLOSE_BANNER
})

export const passwordChangeSuccess = () => ({
    type: BannerActionTypes.PASSWORD_CHANGE_SUCCESS,
    payload: {
        showBanner: true,
        type: 'success',
        content: 'Password changed!',
        error: null
    }
});

export const passwordChangeError = (e) => ({
    type: BannerActionTypes.PASSWORD_CHANGE_ERROR,
    payload: {
        showBanner: true,
        type: 'error',
        content: e,
        error: e
    }
});

export const assignmentCreatedBanner = (message: string, type: 'error' | 'success') => ({
    type: BannerActionTypes.GENERIC_MSG,
    payload: {
        showBanner: true,
        type,
        content: type === 'error' ? null : message,
        error: type === 'error' ? message : null,
    }
});
