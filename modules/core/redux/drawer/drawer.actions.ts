import DrawerActionTypes from "./drawer.types";

export const openSearchDrawer = () => ({
    type: DrawerActionTypes.OPEN_SEARCH_DRAWER
})

export const closeSearchDrawer = () => ({
    type: DrawerActionTypes.CLOSE_SEARCH_DRAWER
});