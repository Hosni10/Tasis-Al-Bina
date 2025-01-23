import { systemRoles } from "../../utilities/systemRole";

export const addUsersEndpoints = {
    ADD_USER: [systemRoles.ADMIN,systemRoles.SUPER_ADMIN],
    UPDATE_USER: [systemRoles.ADMIN,systemRoles.SUPER_ADMIN],
    DELETE_USER: [systemRoles.ADMIN,systemRoles.SUPER_ADMIN]
}