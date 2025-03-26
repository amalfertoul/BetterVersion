<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuotesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $quotes = [
            // Self Love
            [
                'quote_text' => 'You yourself, as much as anybody in the entire universe, deserve your love and affection.',
                'author_name' => 'Buddha',
                'category' => 'self love'
            ],
            [
                'quote_text' => 'Talk to yourself like you would to someone you love.',
                'author_name' => 'Brené Brown',
                'category' => 'self love'
            ],
            [
                'quote_text' => 'Self-care is how you take your power back.',
                'author_name' => 'Lalah Delia',
                'category' => 'self love'
            ],
            [
                'quote_text' => 'You are enough just as you are.',
                'author_name' => 'Megan Markle',
                'category' => 'self love'
            ],
            [
                'quote_text' => 'Self-love is not selfish; you cannot truly love another until you know how to love yourself.',
                'author_name' => 'Unknown',
                'category' => 'self love'
            ],

            // Motivation
            [
                'quote_text' => 'The only way to do great work is to love what you do.',
                'author_name' => 'Steve Jobs',
                'category' => 'motivation'
            ],
            [
                'quote_text' => 'Don\'t watch the clock; do what it does. Keep going.',
                'author_name' => 'Sam Levenson',
                'category' => 'motivation'
            ],
            [
                'quote_text' => 'Believe you can and you\'re halfway there.',
                'author_name' => 'Theodore Roosevelt',
                'category' => 'motivation'
            ],
            [
                'quote_text' => 'Success is not final, failure is not fatal: It is the courage to continue that counts.',
                'author_name' => 'Winston Churchill',
                'category' => 'motivation'
            ],
            [
                'quote_text' => 'The future belongs to those who believe in the beauty of their dreams.',
                'author_name' => 'Eleanor Roosevelt',
                'category' => 'motivation'
            ],

            // Self Development
            [
                'quote_text' => 'The only person you are destined to become is the person you decide to be.',
                'author_name' => 'Ralph Waldo Emerson',
                'category' => 'self development'
            ],
            [
                'quote_text' => 'Personal development is the belief that you are worth the effort, time, and energy needed to develop yourself.',
                'author_name' => 'Denis Waitley',
                'category' => 'self development'
            ],
            [
                'quote_text' => 'Growth begins when we begin to accept our own weakness.',
                'author_name' => 'Jean Vanier',
                'category' => 'self development'
            ],
            [
                'quote_text' => 'The greatest discovery of all time is that a person can change his future by merely changing his attitude.',
                'author_name' => 'Oprah Winfrey',
                'category' => 'self development'
            ],
            [
                'quote_text' => 'Investing in yourself is the best investment you will ever make. It will not only improve your life, it will improve the lives of all those around you.',
                'author_name' => 'Robin Sharma',
                'category' => 'self development'
            ],

            // Philosophy
            [
                'quote_text' => 'The unexamined life is not worth living.',
                'author_name' => 'Socrates',
                'category' => 'philosophy'
            ],
            [
                'quote_text' => 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
                'author_name' => 'Aristotle',
                'category' => 'philosophy'
            ],
            [
                'quote_text' => 'I think, therefore I am.',
                'author_name' => 'René Descartes',
                'category' => 'philosophy'
            ],
            [
                'quote_text' => 'Happiness depends upon ourselves.',
                'author_name' => 'Aristotle',
                'category' => 'philosophy'
            ],
            [
                'quote_text' => 'Man is born free, and everywhere he is in chains.',
                'author_name' => 'Jean-Jacques Rousseau',
                'category' => 'philosophy'
            ],

            // Wisdom
            [
                'quote_text' => 'The only true wisdom is in knowing you know nothing.',
                'author_name' => 'Socrates',
                'category' => 'wisdom'
            ],
            [
                'quote_text' => 'Knowing yourself is the beginning of all wisdom.',
                'author_name' => 'Aristotle',
                'category' => 'wisdom'
            ],
            [
                'quote_text' => 'Turn your wounds into wisdom.',
                'author_name' => 'Oprah Winfrey',
                'category' => 'wisdom'
            ],
            [
                'quote_text' => 'The fool doth think he is wise, but the wise man knows himself to be a fool.',
                'author_name' => 'William Shakespeare',
                'category' => 'wisdom'
            ],
            [
                'quote_text' => 'Wisdom is not a product of schooling but of the lifelong attempt to acquire it.',
                'author_name' => 'Albert Einstein',
                'category' => 'wisdom'
            ],

            // Success
            [
                'quote_text' => 'Success is stumbling from failure to failure with no loss of enthusiasm.',
                'author_name' => 'Winston Churchill',
                'category' => 'success'
            ],
            [
                'quote_text' => 'Success usually comes to those who are too busy to be looking for it.',
                'author_name' => 'Henry David Thoreau',
                'category' => 'success'
            ],
            [
                'quote_text' => 'The secret of success is to do the common thing uncommonly well.',
                'author_name' => 'John D. Rockefeller',
                'category' => 'success'
            ],
            [
                'quote_text' => 'Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.',
                'author_name' => 'Albert Schweitzer',
                'category' => 'success'
            ],
            [
                'quote_text' => 'Success is walking from failure to failure with no loss of enthusiasm.',
                'author_name' => 'Winston Churchill',
                'category' => 'success'
            ],

            // Life
            [
                'quote_text' => 'Life is what happens when you\'re busy making other plans.',
                'author_name' => 'John Lennon',
                'category' => 'life'
            ],
            [
                'quote_text' => 'In the end, it\'s not the years in your life that count. It\'s the life in your years.',
                'author_name' => 'Abraham Lincoln',
                'category' => 'life'
            ],
            [
                'quote_text' => 'Life is really simple, but we insist on making it complicated.',
                'author_name' => 'Confucius',
                'category' => 'life'
            ],
            [
                'quote_text' => 'The purpose of our lives is to be happy.',
                'author_name' => 'Dalai Lama',
                'category' => 'life'
            ],
            [
                'quote_text' => 'Life is 10% what happens to me and 90% how I react to it.',
                'author_name' => 'Charles Swindoll',
                'category' => 'life'
            ],

            // Inspiration
            [
                'quote_text' => 'Inspiration comes from within yourself. One has to be positive. When you\'re positive, good things happen.',
                'author_name' => 'Deep Roy',
                'category' => 'inspiration'
            ],
            [
                'quote_text' => 'The best way to predict the future is to create it.',
                'author_name' => 'Peter Drucker',
                'category' => 'inspiration'
            ],
            [
                'quote_text' => 'You can\'t use up creativity. The more you use, the more you have.',
                'author_name' => 'Maya Angelou',
                'category' => 'inspiration'
            ],
            [
                'quote_text' => 'Do one thing every day that scares you.',
                'author_name' => 'Eleanor Roosevelt',
                'category' => 'inspiration'
            ],
            [
                'quote_text' => 'The only limit to our realization of tomorrow will be our doubts of today.',
                'author_name' => 'Franklin D. Roosevelt',
                'category' => 'inspiration'
            ],

            // Leadership
            [
                'quote_text' => 'Leadership is the capacity to translate vision into reality.',
                'author_name' => 'Warren Bennis',
                'category' => 'leadership'
            ],
            [
                'quote_text' => 'A leader is one who knows the way, goes the way, and shows the way.',
                'author_name' => 'John C. Maxwell',
                'category' => 'leadership'
            ],
            [
                'quote_text' => 'The greatest leader is not necessarily the one who does the greatest things. He is the one that gets the people to do the greatest things.',
                'author_name' => 'Ronald Reagan',
                'category' => 'leadership'
            ],
            [
                'quote_text' => 'Leadership is not about being in charge. It is about taking care of those in your charge.',
                'author_name' => 'Simon Sinek',
                'category' => 'leadership'
            ],
            [
                'quote_text' => 'Before you are a leader, success is all about growing yourself. When you become a leader, success is all about growing others.',
                'author_name' => 'Jack Welch',
                'category' => 'leadership'
            ],

            // Happiness
            [
                'quote_text' => 'Happiness is not something ready made. It comes from your own actions.',
                'author_name' => 'Dalai Lama',
                'category' => 'happiness'
            ],
            [
                'quote_text' => 'The happiest people don\'t have the best of everything, they make the best of everything.',
                'author_name' => 'Unknown',
                'category' => 'happiness'
            ],
            [
                'quote_text' => 'Happiness depends upon ourselves.',
                'author_name' => 'Aristotle',
                'category' => 'happiness'
            ],
            [
                'quote_text' => 'There is only one happiness in this life, to love and be loved.',
                'author_name' => 'George Sand',
                'category' => 'happiness'
            ],
            [
                'quote_text' => 'Happiness is when what you think, what you say, and what you do are in harmony.',
                'author_name' => 'Mahatma Gandhi',
                'category' => 'happiness'
            ]
        ];

        DB::table('quotes')->insert($quotes);
    }
}