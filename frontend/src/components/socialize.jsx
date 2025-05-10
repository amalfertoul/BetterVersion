import React from 'react';
import ChatsTesting from '../sections/chats';
import FriendRequest from '../sections/friendRequest';
import FriendsList from '../sections/friendsList';
import Suggestions from '../sections/suggestions';
import '../style/socialize.css';

const Socialize = () => {
    const [activeTab, setActiveTab] = React.useState(0);
    const pagesRef = React.useRef(null);
    
    const tabs = [
        { title: "Chats", component: <ChatsTesting /> },
        { title: "Requests", component: <FriendRequest /> },
        { title: "Friends", component: <FriendsList /> },
        { title: "Suggestions", component: <Suggestions /> }
    ];

    const goToPage = (index) => {
        setActiveTab(index);
        if (pagesRef.current) {
            pagesRef.current.scrollTo({
                left: pagesRef.current.clientWidth * index,
                behavior: 'smooth'
            });
        }
    };

    // Handle swipe gestures
    React.useEffect(() => {
        const pagesElement = pagesRef.current;
        if (!pagesElement) return;

        let startX = 0;
        let isDown = false;

        const handleMouseDown = (e) => {
            isDown = true;
            startX = e.pageX - pagesElement.offsetLeft;
        };

        const handleMouseMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - pagesElement.offsetLeft;
            const walk = (x - startX) * 2;
            pagesElement.scrollLeft -= walk;
        };

        const handleMouseUp = () => {
            isDown = false;
        };

        const handleTouchStart = (e) => {
            startX = e.touches[0].pageX - pagesElement.offsetLeft;
        };

        const handleTouchMove = (e) => {
            e.preventDefault();
            const x = e.touches[0].pageX - pagesElement.offsetLeft;
            const walk = (x - startX);
            pagesElement.scrollLeft -= walk;
        };

        const handleScroll = () => {
            const scrollPosition = pagesElement.scrollLeft;
            const pageWidth = pagesElement.clientWidth;
            const newActiveIndex = Math.round(scrollPosition / pageWidth);
            setActiveTab(newActiveIndex);
        };

        pagesElement.addEventListener('mousedown', handleMouseDown);
        pagesElement.addEventListener('mousemove', handleMouseMove);
        pagesElement.addEventListener('mouseup', handleMouseUp);
        pagesElement.addEventListener('mouseleave', handleMouseUp);
        pagesElement.addEventListener('touchstart', handleTouchStart);
        pagesElement.addEventListener('touchmove', handleTouchMove);
        pagesElement.addEventListener('scroll', handleScroll);

        return () => {
            pagesElement.removeEventListener('mousedown', handleMouseDown);
            pagesElement.removeEventListener('mousemove', handleMouseMove);
            pagesElement.removeEventListener('mouseup', handleMouseUp);
            pagesElement.removeEventListener('mouseleave', handleMouseUp);
            pagesElement.removeEventListener('touchstart', handleTouchStart);
            pagesElement.removeEventListener('touchmove', handleTouchMove);
            pagesElement.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="socialize-container">
            <div className="socialize-tabs">
                {tabs.map((tab, index) => (
                    <div 
                        key={index}
                        className={`socialize-tab ${activeTab === index ? 'active' : ''}`}
                        onClick={() => goToPage(index)}
                    >
                        {tab.title}
                    </div>
                ))}
            </div>
            
            <div className="socialize-pages" ref={pagesRef}>
                {tabs.map((tab, index) => (
                    <div key={index} className="socialize-page">
                        {tab.component}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Socialize;