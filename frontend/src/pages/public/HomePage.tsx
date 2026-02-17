import React from 'react';
import { Box, Button, Container, Grid, Typography, Paper, Link } from '@mui/material';
import { Link as ScrollLink } from 'react-scroll';
import BookingWidget from '../../components/public/BookingWidget';
import AiChat from '../../components/public/AiChat';
import IntakeForm from '../../components/public/IntakeForm';

export const HomePage = () => {
    return (
        <Box>
            {/* NAV */}
            <Box component="nav" sx={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
                borderBottom: '1px solid #e2e8f0', px: 3, height: 68,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <Link href="#" underline="none" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        width: 40, height: 40, bgcolor: '#1a6b5a', borderRadius: 1.5,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 700, fontSize: 18
                    }}>QW</Box>
                    <Typography variant="h6" sx={{ color: '#0f4a3e', fontWeight: 700 }}>Queen West CTCHC</Typography>
                </Link>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
                    {['Services', 'How It Works', 'Booking', 'AI Assistant', 'Intake Form'].map((item) => (
                        <ScrollLink key={item} to={item.toLowerCase().replace(/ /g, '-')} smooth={true} duration={500} offset={-70} style={{ cursor: 'pointer', color: '#718096', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
                            {item}
                        </ScrollLink>
                    ))}
                    <ScrollLink to="booking" smooth={true} duration={500} offset={-70}>
                        <Button variant="contained" sx={{ bgcolor: '#1a6b5a', '&:hover': { bgcolor: '#0f4a3e' } }}>Book Now</Button>
                    </ScrollLink>
                </Box>
            </Box>

            {/* HERO */}
            <Box sx={{
                mt: '68px', pt: 10, pb: 8, px: 2,
                background: 'linear-gradient(135deg, #e8f5f1 0%, #d5f0e8 50%, #f0f9f6 100%)',
                textAlign: 'center', position: 'relative', overflow: 'hidden'
            }}>
                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h2" sx={{ color: '#0f4a3e', fontWeight: 800, mb: 2, lineHeight: 1.2 }}>
                        Your Community Health, Now Accessible Anytime
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#718096', mb: 4, maxWidth: 600, mx: 'auto' }}>
                        Queen West – Central Toronto Community Health Centres. Book appointments online, complete intake forms before your visit, and get instant answers — 24/7.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 6 }}>
                        <ScrollLink to="booking" smooth={true} duration={500} offset={-70}>
                            <Button variant="contained" size="large" sx={{ bgcolor: '#1a6b5a', px: 4, py: 1.5, fontSize: '1rem', '&:hover': { bgcolor: '#0f4a3e' } }}>
                                📅 Book an Appointment
                            </Button>
                        </ScrollLink>
                        <ScrollLink to="ai-assistant" smooth={true} duration={500} offset={-70}>
                            <Button variant="outlined" size="large" sx={{ color: '#1a6b5a', borderColor: '#1a6b5a', px: 4, py: 1.5, fontSize: '1rem', bgcolor: 'white', '&:hover': { bgcolor: '#e8f5f1' } }}>
                                💬 Ask AI Assistant
                            </Button>
                        </ScrollLink>
                    </Box>
                    <Grid container spacing={4} justifyContent="center" sx={{ textAlign: 'center' }}>
                        {[
                            { num: '24/7', label: 'Online Access' },
                            { num: '60-90', label: 'Patients Served Daily' },
                            { num: '~30%', label: 'Reduced Wait Times' }
                        ].map((stat, i) => (
                            <Grid item key={i}>
                                <Typography variant="h4" sx={{ color: '#1a6b5a', fontWeight: 800 }}>{stat.num}</Typography>
                                <Typography variant="body2" sx={{ color: '#718096' }}>{stat.label}</Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* SERVICES */}
            <Box id="services" sx={{ py: 10 }}>
                <Container maxWidth="lg">
                    <Box textAlign="center" mb={6}>
                        <Chip text="Our Services" />
                        <Typography variant="h3" sx={{ color: '#0f4a3e', fontWeight: 700, mt: 1 }}>Comprehensive Primary Care</Typography>
                        <Typography sx={{ color: '#718096', mt: 1 }}>Serving Toronto's diverse community with accessible, equitable healthcare services.</Typography>
                    </Box>
                    <Grid container spacing={3}>
                        {[
                            { icon: '🩺', title: 'General Primary Care', desc: 'Routine check-ups, health assessments, chronic disease management and preventive care.', bg: '#e8f5f1' },
                            { icon: '📋', title: 'Referrals & Follow-ups', desc: 'Specialist referrals, lab follow-ups, and coordinated care plans managed through your team.', bg: '#fff4eb' },
                            { icon: '👨👩👧', title: 'Family Health Services', desc: 'Comprehensive care for families including pediatric visits, women\'s health, and elderly care.', bg: '#ebf4ff' }
                        ].map((s, i) => (
                            <Grid item xs={12} md={4} key={i}>
                                <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', height: '100%', transition: 'all .3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', borderColor: '#1a6b5a' } }}>
                                    <Box sx={{ width: 52, height: 52, borderRadius: 3, bgcolor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', mb: 2 }}>{s.icon}</Box>
                                    <Typography variant="h6" sx={{ color: '#0f4a3e', mb: 1 }}>{s.title}</Typography>
                                    <Typography variant="body2" sx={{ color: '#718096' }}>{s.desc}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* HOW IT WORKS */}
            <Box id="how-it-works" sx={{ py: 10, bgcolor: 'white' }}>
                <Container maxWidth="lg">
                    <Box textAlign="center" mb={6}>
                        <Chip text="How It Works" />
                        <Typography variant="h3" sx={{ color: '#0f4a3e', fontWeight: 700, mt: 1 }}>Simple Steps to Care</Typography>
                        <Typography sx={{ color: '#718096', mt: 1 }}>Our digital portal streamlines your visit from booking to check-in.</Typography>
                    </Box>
                    <Grid container spacing={4} justifyContent="center" alignItems="center">
                        {[
                            { step: 1, title: 'Visit Our Portal', desc: 'Browse clinic info. Ask the AI assistant questions.' },
                            { step: 2, title: 'Book Online', desc: 'Select your doctor, preferred time, and confirm instantly.' },
                            { step: 3, title: 'Complete Intake', desc: 'Fill out digital intake forms before your visit.' },
                            { step: 4, title: 'Get Reminders', desc: 'Receive automated SMS/email reminders.' }
                        ].map((s, i) => (
                            <Grid item xs={12} sm={6} md={3} key={i} textAlign="center" sx={{ position: 'relative' }}>
                                <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#1a6b5a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', mx: 'auto', mb: 2 }}>
                                    {s.step}
                                </Box>
                                <Typography variant="h6" sx={{ color: '#0f4a3e', mb: 0.5 }}>{s.title}</Typography>
                                <Typography variant="body2" sx={{ color: '#718096', px: 2 }}>{s.desc}</Typography>
                                {i < 3 && <Typography sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', right: -10, top: 40, color: '#e2e8f0', fontSize: '1.5rem' }}>→</Typography>}
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* BOOKING */}
            <Box id="booking" sx={{ py: 10, background: 'linear-gradient(135deg, #1a6b5a 0%, #0f4a3e 100%)', color: 'white' }}>
                <Container maxWidth="lg">
                    <Box textAlign="center" mb={6}>
                        <Box component="span" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', px: 2, py: 0.5, borderRadius: 5, fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Online Booking</Box>
                        <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mt: 2 }}>Book Your Appointment Anytime</Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>No more waiting on hold. Select a time that works for you — available 24/7.</Typography>
                    </Box>
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {[
                                    { icon: '🕐', title: '24/7 Availability', desc: 'Book outside business hours — whenever suits you.' },
                                    { icon: '✅', title: 'Instant Confirmation', desc: 'Receive immediate SMS/email confirmation.' },
                                    { icon: '🔔', title: 'Automated Reminders', desc: 'Get reminders before your visit to reduce no-shows.' },
                                    { icon: '🔒', title: 'PHIPA Compliant', desc: 'All data securely handled via Jane App infrastructure.' }
                                ].map((f, i) => (
                                    <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                                        <Box sx={{ minWidth: 36, height: 36, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{f.icon}</Box>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={600}>{f.title}</Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.8 }}>{f.desc}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Paper sx={{ p: 4, borderRadius: 3 }}>
                                <BookingWidget />
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* AI CHAT */}
            <Box id="ai-assistant" sx={{ py: 10, bgcolor: '#f7fafc' }}>
                <Container maxWidth="lg">
                    <Box textAlign="center" mb={6}>
                        <Chip text="AI Assistant" />
                        <Typography variant="h3" sx={{ color: '#0f4a3e', fontWeight: 700, mt: 1 }}>Get Instant Answers</Typography>
                        <Typography sx={{ color: '#718096', mt: 1 }}>Our AI assistant handles routine questions so you don't have to wait on hold.</Typography>
                    </Box>
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" sx={{ color: '#0f4a3e', mb: 2 }}>What can the assistant help with?</Typography>
                            <Typography sx={{ color: '#718096', mb: 3 }}>The AI chat handles non-clinical, administrative inquiries — saving you a phone call and freeing up staff for complex requests.</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {[
                                    'What are your clinic hours?',
                                    'How do I prepare for my visit?',
                                    'Where is the clinic located?',
                                    'Do I need to bring my health card?',
                                    'How do I get a referral?'
                                ].map((q, i) => (
                                    <Box key={i} sx={{ px: 2, py: 1, bgcolor: 'white', borderRadius: 2, border: '1px solid #e2e8f0', fontSize: '0.9rem' }}>
                                        <Typography component="span" color="primary" fontWeight={600}>Q: </Typography>{q}
                                    </Box>
                                ))}
                            </Box>
                            <Typography sx={{ mt: 3, fontSize: '0.85rem', color: '#f0984a', fontWeight: 600 }}>⚠️ For medical advice or urgent concerns, please call the clinic directly or visit Emergency Services.</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <AiChat />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* INTAKE FORM */}
            <Box id="intake-form" sx={{ py: 10, bgcolor: 'white' }}>
                <Container maxWidth="lg">
                    <Box textAlign="center" mb={6}>
                        <Chip text="Digital Intake" />
                        <Typography variant="h3" sx={{ color: '#0f4a3e', fontWeight: 700, mt: 1 }}>Complete Your Intake Online</Typography>
                        <Typography sx={{ color: '#718096', mt: 1 }}>Save time at check-in by filling out your pre-visit forms from home.</Typography>
                    </Box>
                    <Grid container spacing={6} alignItems="start">
                        <Grid item xs={12} md={7}>
                            <IntakeForm />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
                                {[
                                    { icon: '⏱️', title: 'Save 10-15 Minutes', desc: 'Complete forms at your own pace. No more clipboards.' },
                                    { icon: '📱', title: 'Mobile Friendly', desc: 'Fill out forms from your phone, tablet, or computer.' },
                                    { icon: '✏️', title: 'Reduce Errors', desc: 'Digital forms eliminate handwriting misreads.' },
                                    { icon: '🔐', title: 'Secure & Private', desc: 'All data encrypted and stored on localized servers.' }
                                ].map((b, i) => (
                                    <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                                        <Box sx={{ minWidth: 44, height: 44, borderRadius: 2, bgcolor: '#e8f5f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{b.icon}</Box>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={600} color="#0f4a3e">{b.title}</Typography>
                                            <Typography variant="body2" color="textSecondary">{b.desc}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* CLINIC INFO */}
            <Box id="info" sx={{ py: 8 }}>
                <Container maxWidth="lg">
                    <Box textAlign="center" mb={6}>
                        <Chip text="Clinic Information" />
                        <Typography variant="h3" sx={{ color: '#0f4a3e', fontWeight: 700, mt: 1 }}>Visit Us</Typography>
                    </Box>
                    <Grid container spacing={3}>
                        {[
                            { icon: '📍', title: 'Location', desc: <>{'Queen Street West'}<br />{'Central Toronto, ON'}<br />{'Canada'}</> },
                            { icon: '🕘', title: 'Clinic Hours', desc: <>{'Monday – Friday: 9:00 AM – 5:00 PM'}<br />{'Saturday: 10:00 AM – 2:00 PM'}<br />{'Sunday: Closed'}</> },
                            { icon: '📞', title: 'Contact', desc: <>{'Phone: (416) XXX-XXXX'}<br />{'Email: info@ctchc.ca'}<br /><strong>{'Online: 24/7 Portal'}</strong></> }
                        ].map((info, i) => (
                            <Grid item xs={12} md={4} key={i}>
                                <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', textAlign: 'center', height: '100%', transition: 'all .3s', '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.06)' } }}>
                                    <Typography sx={{ fontSize: '2rem', mb: 1.5 }}>{info.icon}</Typography>
                                    <Typography variant="h6" sx={{ color: '#0f4a3e', mb: 1 }}>{info.title}</Typography>
                                    <Typography variant="body2" color="textSecondary">{info.desc}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* FOOTER */}
            <Box component="footer" sx={{ bgcolor: '#0f4a3e', color: 'rgba(255,255,255,0.7)', py: 6, fontSize: '0.85rem' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={5}>
                            <Typography variant="h6" color="white" gutterBottom>Queen West – CTCHC</Typography>
                            <Typography>Community-based primary care serving Toronto's diverse population. Committed to accessible, equitable healthcare for all.</Typography>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography variant="subtitle2" color="white" gutterBottom>Quick Links</Typography>
                            {['Services', 'Book Online', 'Intake Forms', 'Contact'].map((item) => (
                                <Box key={item} mb={0.5}><Link href="#" color="inherit" underline="hover">{item}</Link></Box>
                            ))}
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography variant="subtitle2" color="white" gutterBottom>Patient Resources</Typography>
                            {['Visit Preparation', 'Referral Process', 'Prescription Renewals', 'FAQ'].map((item) => (
                                <Box key={item} mb={0.5}><Link href="#" color="inherit" underline="hover">{item}</Link></Box>
                            ))}
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="subtitle2" color="white" gutterBottom>Legal & Privacy</Typography>
                            {['Privacy Policy (PHIPA)', 'Terms of Service', 'Accessibility', 'Data Security'].map((item) => (
                                <Box key={item} mb={0.5}><Link href="#" color="inherit" underline="hover">{item}</Link></Box>
                            ))}
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                        <Typography variant="caption">© 2026 Queen West – Central Toronto Community Health Centres. All rights reserved.</Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

const Chip = ({ text }: { text: string }) => (
    <Box component="span" sx={{
        bgcolor: '#e8f5f1', color: '#1a6b5a', px: 2, py: 0.5, borderRadius: 5,
        fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5
    }}>
        {text}
    </Box>
);
