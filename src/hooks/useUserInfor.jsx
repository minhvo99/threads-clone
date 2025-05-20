import { useSelector } from 'react-redux';

const useUserInfor = () => {
    return useSelector((state) => state.userInfor);
};

export default useUserInfor;
