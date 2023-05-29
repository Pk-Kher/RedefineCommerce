import React from 'react';
import Danger from './Danger';
import Info from './Info';
import Success from './Success';
import Warning from './Warning';
import { useSelector } from "react-redux";
const Index = (props) => {
    const { type, ...rest } = props;
    // const [message, setMessage] = useState('');
    // useEffect(() => {
    //     if (props.message !== '' && props.message !== undefined) {
    //         localStorage.setItem('flash_msg', JSON.stringify({ message: props.message }));
    //         setMessage(JSON.parse(localStorage.getItem('flash_msg')))
    //     }
    // }, [props.message]);
    // if (message !== '' || message === undefined) {
    //     setTimeout(() => {
    //         localStorage.removeItem('flash_msg');
    //         setMessage('');
    //         console.log('timeout');
    //     }, 10000);
    // }
    const messageInfo = useSelector((state) => state.alertMessage);
    switch (messageInfo.type) {
        case 'danger': return <Danger {...rest} />;
        case 'info': return <Info {...rest} />;
        case 'success': return <Success {...rest} />;
        case 'warning': return <Warning {...rest} />;
        default: return ''
    }

}

export default Index