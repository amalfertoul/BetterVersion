import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuotes } from '../slices/QuotesSlice'; 

const Quotes = () => {
    const dispatch = useDispatch();
    const { quotes, loading, error } = useSelector((state) => state.quotes);

    useEffect(() => {
        dispatch(fetchQuotes());
    }, [dispatch]);

    const getDailyQuote = () => {
        if (quotes.length === 0) return null;
        const today = new Date();
        const index = today.getDate() % quotes.length; // Use the day of the month to pick a quote
        return quotes[index];
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const dailyQuote = getDailyQuote();

    return (
        <div>
            <h1>Quote of the Day</h1>
            {dailyQuote ? (
                <blockquote>
                    <p>{dailyQuote.quote_text}</p>
                    <footer>- {dailyQuote.author_name || 'Unknown'}</footer>
                </blockquote>
            ) : (
                <p>No quotes available.</p>
            )}
        </div>
    );
};

export default Quotes;