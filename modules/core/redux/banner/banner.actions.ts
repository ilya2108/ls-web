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