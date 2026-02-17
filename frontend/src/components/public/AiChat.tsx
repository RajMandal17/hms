import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

interface Message {
    text: string;
    sender: 'user' | 'bot';
}

const responses: { [key: string]: string } = {
    hours: "Our clinic is open Monday–Friday 9:00 AM to 5:00 PM, and Saturday 10:00 AM to 2:00 PM. We are closed on Sundays. Online booking is available 24/7!",
    location: "We're located on Queen Street West in Central Toronto. The clinic is accessible by TTC and has nearby street parking.",
    prepare: "For your visit, please bring: your Ontario Health Card, a list of current medications, and any relevant medical records. You can also complete your intake form online before arriving!",
    health: "Yes! Please bring your valid Ontario Health Card (OHIP) to every visit. If your card has expired, please contact ServiceOntario before your appointment.",
    referral: "To request a referral, please book a general appointment with your physician. They will assess your needs and provide a referral to the appropriate specialist. You can book online now!",
    book: "You can book an appointment by clicking 'Book Now' at the top of this page, or scroll down to the booking section. You'll be securely redirected to Jane App to select your time.",
    default: "I can help with questions about clinic hours, location, visit preparation, health card requirements, referrals, and booking. For medical advice, please call the clinic directly."
};

const getResponse = (input: string) => {
    const q = input.toLowerCase();
    if (q.includes('hour') || q.includes('open') || q.includes('close') || q.includes('time')) return responses.hours;
    if (q.includes('where') || q.includes('location') || q.includes('address') || q.includes('direction') || q.includes('park')) return responses.location;
    if (q.includes('prepare') || q.includes('bring') || q.includes('before') || q.includes('need')) return responses.prepare;
    if (q.includes('health card') || q.includes('ohip') || q.includes('card')) return responses.health;
    if (q.includes('referral') || q.includes('specialist')) return responses.referral;
    if (q.includes('book') || q.includes('appointment') || q.includes('schedule')) return responses.book;
    return responses.default;
};

const AiChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { text: "Hello! 👋 I'm the CTCHC virtual assistant. I can help with clinic hours, visit preparation, location info, and more. How can I help you today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg: Message = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        setTimeout(() => {
            const botMsg: Message = { text: getResponse(input), sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
        }, 600);
    };

    return (
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <Box sx={{ bgcolor: '#1a6b5a', color: 'white', p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#68d391' }} />
                <Typography variant="subtitle1" fontWeight={600}>CTCHC AI Assistant</Typography>
            </Box>
            <Box sx={{ height: 300, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {messages.map((msg, idx) => (
                    <Box key={idx} sx={{
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: msg.sender === 'user' ? '#e8f5f1' : '#f1f5f9',
                        color: msg.sender === 'user' ? '#0f4a3e' : '#2d3748',
                        borderBottomRightRadius: msg.sender === 'user' ? 4 : 12,
                        borderBottomLeftRadius: msg.sender === 'bot' ? 4 : 12
                    }}>
                        <Typography variant="body2">{msg.text}</Typography>
                    </Box>
                ))}
                <div ref={messagesEndRef} />
            </Box>
            <Box sx={{ p: 1.5, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Ask about hours, location..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <Button variant="contained" onClick={handleSend} sx={{ bgcolor: '#1a6b5a', '&:hover': { bgcolor: '#0f4a3e' } }}>
                    Send
                </Button>
            </Box>
        </Paper>
    );
};

export default AiChat;
