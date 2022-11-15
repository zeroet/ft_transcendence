export interface IUserService {
    getUsers(): any;
    getUserById(id: number): any;
    updateUserById(id: number): any;
}
