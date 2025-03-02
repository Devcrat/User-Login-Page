import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import icon from '../../image.png';
import Menu from '@mui/material/Menu';
import TableChartIcon from '@mui/icons-material/TableChart';
import { getAllUsers, tokenCheck } from '../../utils/Api';
import { useDispatch, useSelector } from 'react-redux';
import { getUserlist } from '../../utils/Store/UserSlice';
import './Home.scss';

const Home = () => {
  // eslint-disable-next-line no-unused-vars
  const data = useSelector((store) => store.admin.adminList);
  const name = localStorage.getItem('name');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openProfile = Boolean(anchorEl);

  const handleClick = (action) => {
    if (action === 'home') {
      navigate('/home/welcome');
    } else if (action === 'table') {
      navigate('/home/table');
    }
  };
  const handleProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleToggle = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const handleUser = async () => {
    try {
      navigate('/home/profile');
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('name');
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    const handleData = async () => {
      try {
        const userData = await getAllUsers('all');
        dispatch(getUserlist(userData?.data?.data));
      } catch (error) {
        console.error(error);
      }
    };
    handleData();
  }, [dispatch]);

  useEffect(() => {
    const handleToken = async () => {
      try {
        const verifyToken = await tokenCheck('check');
        return verifyToken;
      } catch (error) {
        console.error(error);
        navigate('/login', { replace: true });
      }
    };

    const setUpInterval = () => {
      handleToken();
      const intervalId = setInterval(handleToken, 15 * 60 * 1000);
      return () => clearInterval(intervalId);
    };

    const cleanup = setUpInterval();
    return cleanup;
  }, []);

  return (
    <>
      <div className="home-div1-cnt">
        <button onClick={() => handleClick('home')}>
          <HomeIcon className="home-button1-cnt" />
        </button>
        <button className="" onClick={() => handleClick('table')}>
          <TableChartIcon />
        </button>
        <span className="home-span1-cnt">UserTable</span>
        <img
          src={icon}
          alt=""
          className="home-img1-cnt"
          onClick={(e) => handleProfile(e)}
        />
        <Menu anchorEl={anchorEl} open={openProfile} onClose={handleClose}>
          <div className="home-div2-cnt">
            <span>Hii</span>
            <span className="home-div3-cnt" onClick={() => handleUser()}>
              {name?.split(' ')[0]}
            </span>
            <button className="home-button2-cnt" onClick={() => handleLogout()}>
              Logout
            </button>
          </div>
        </Menu>
        <div className="home-div4-cnt" onClick={handleToggle}>
          {isDarkMode ? '🌞' : '🌙'}
        </div>
      </div>

      <Outlet />
    </>
  );
};

export default Home;
