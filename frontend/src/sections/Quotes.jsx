import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuotes } from '../slices/QuotesSlice';
import '../style/quotes.css';

const Quotes = () => {
    const dispatch = useDispatch();
    const { quotes, loading, error } = useSelector((state) => state.quotes);
    const [isClicked, setIsClicked] = useState(false);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        dispatch(fetchQuotes());
    }, [dispatch]);

    const getDailyQuote = () => {
        if (quotes.length === 0) return null;
        const today = new Date();
        const index = today.getDate() % quotes.length;
        return quotes[index];
    };

    const handleClick = () => {
        setIsClicked(true);
        // Wait for the title to fade out before showing the content
        setTimeout(() => {
            setShowContent(true);
        }, 300);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const dailyQuote = getDailyQuote();

    return (
        <div className="quotes-container" onClick={handleClick}>
            <h1 className={`quotes-title ${isClicked ? 'fade-out' : ''}`}>
                Quote of the Day
            </h1>
            <div className={`quotes-content ${showContent ? 'visible' : ''}`}>
                {dailyQuote ? (
                    <blockquote>
                        <p>{dailyQuote.quote_text}</p>
                        <footer>- {dailyQuote.author_name || 'Unknown'}</footer>
                    </blockquote>
                ) : (
                    <p>No quotes available.</p>
                )}
            </div>
        </div>
    );
};

export default Quotes;