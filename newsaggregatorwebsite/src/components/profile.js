import AuthUser from "../services/authenticationapi";
export function Profile(){
    const { user } = AuthUser();
    return(
        <><h1 className='text-center mt-3'>Your Details</h1><div>
            <p><b>Name:</b> {user.name}</p>
            <p><b>Email Address:</b> {user.email}</p>
        </div></>
    );
}