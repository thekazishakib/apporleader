import { motion, useScroll, useTransform, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { Globe, BookOpen, BrainCircuit, Briefcase, Trophy, ArrowRight, ChevronRight, Sparkles, Users, Calendar, Star, Zap, Target, CheckCircle2, ChevronDown, MapPin, Clock, MessageSquare, FileText, Crown } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { Helmet } from 'react-helmet-async';

function AnimatedStat({ value, suffix = "" }: { value: number, suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest) + suffix);

  useEffect(() => {
    const controls = animate(count, value, { duration: 2, ease: "easeOut", delay: 0.8 });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

const features = [
  {
    title: 'AI Segment',
    description: 'Comprehensive guides and challenges to master artificial intelligence tools.',
    icon: BrainCircuit,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    title: 'Business Case Study Segment',
    description: 'Analyze real-world case studies and develop strategic business solutions.',
    icon: Briefcase,
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
  {
    title: 'Competition Segment',
    description: 'Participate in elite tournaments and showcase your skills to win prizes.',
    icon: Trophy,
    color: 'text-btn',
    bg: 'bg-btn/10',
  },
  {
    title: 'Abroad Segment',
    description: 'Tips, resources, and expert consultations for your international education journey.',
    icon: Globe,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    title: 'Article Segment',
    description: 'Read and write insightful articles on logic, technology, and strategy.',
    icon: FileText,
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
  {
    title: 'Magazine Segment',
    description: 'Stay updated with our curated magazines featuring top industry trends.',
    icon: BookOpen,
    color: 'text-highlight',
    bg: 'bg-highlight/10',
  },
  {
    title: 'Chess Segment',
    description: 'Master the board with tutorials, strategies, and practice matches.',
    icon: Crown,
    color: 'text-btn',
    bg: 'bg-btn/10',
  },
];

const benefits = [
  {
    title: 'Accelerated Learning',
    description: 'Our structured curriculum and hands-on projects ensure you learn faster and retain more.',
    icon: Zap,
  },
  {
    title: 'Global Network',
    description: 'Connect with ambitious peers and industry experts from around the world.',
    icon: Users,
  },
  {
    title: 'Career Advancement',
    description: 'Gain the skills and portfolio needed to land top-tier roles in tech and business.',
    icon: Target,
  },
];

const testimonials = [
  {
    quote: "As a class x student, I thought I knew AI, but the AI Segment at ApoorLeader showed me the power of advanced Prompt Engineering. The workshops here don't just teach you tools; they teach you a new way of thinking. Truly a game-changer for my career.",
    author: "Azmira Alamgir",
    role: "Content Creator",
  },
  {
    quote: "The Chess Segment is where I learned that logic on the board is the same as logic in life. Competing in the monthly tournaments has sharpened my focus and taught me how to stay calm under pressure. ApoorLeader is the perfect arena for strategic minds.",
    author: "Nowshin Atia",
    role: "Member & Ambassador",
  },
  {
    quote: "Navigating international admissions felt impossible until I joined the Abroad Segment. The step-by-step guidance on scholarship applications and profile building was the reason I secured my offer letter. I couldn't have done it without this community.",
    author: "Tasnim Jannat",
    role: "Member",
  },
  {
    quote: "The Business Case Study Segment is like a mini-MBA. Analyzing real-world failures and successes like Netflix vs. Blockbuster gave me insights that textbooks simply don't offer. It’s an essential community for any aspiring entrepreneur.",
    author: "Mahir Razz",
    role: "Member and Ambassador",
  },
  {
    quote: "I joined for the Competition Segment, and the energy here is infectious. The challenges are tough, the peers are brilliant, and the rewards are real. If you want to test your limits and actually 'Win the Game,' this is where you belong.",
    author: "Eistiak Alam",
    role: "Member and Representative",
  }
];

const journeySteps = [
  {
    step: "01",
    title: "Join the Community",
    description: "Fill out the application form and get access to our exclusive Discord server and member portal.",
  },
  {
    step: "02",
    title: "Attend Workshops",
    description: "Participate in weekly live sessions covering AI, logic, business strategy, and more.",
  },
  {
    step: "03",
    title: "Compete & Collaborate",
    description: "Join tournaments, solve case studies with peers, and build your portfolio.",
  },
  {
    step: "04",
    title: "Lead & Mentor",
    description: "Become a segment leader, host your own sessions, and guide the next generation of members.",
  },
];

const faqs = [
  {
    question: "Is membership really free?",
    answer: "Yes! ApporLeader is 100% free to join. We believe in accessible education and community building. Some special events or premium resources might have a small fee, but core membership is free.",
  },
  {
    question: "Do I need prior experience in AI or Chess?",
    answer: "Not at all. We have segments and resources tailored for absolute beginners as well as advanced practitioners. Our community is here to help you learn and grow from any level.",
  },
  {
    question: "How much time do I need to commit?",
    answer: "You can be as active as you want. We recommend attending at least one workshop or event per week (about 1-2 hours) to get the most out of your membership, but there are no strict requirements.",
  },
  {
    question: "Can I host my own workshop?",
    answer: "Absolutely! We encourage active members to share their knowledge. Once you've been a member for a while, you can apply to host sessions or even lead a new segment.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Home() {
  const { events } = useAdmin();
  const testimonialsRef = useRef(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: testimonialsRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div className="w-full">
      <Helmet>
        <title>ApporLeader | Decoding Logic, Mastering AI, Winning the Game</title>
        <meta name="description" content="ApporLeader is a community for logic, AI, and business strategy. Join us for workshops, competitions, and global networking." />
        <meta name="keywords" content="ApporLeader, AI, Artificial Intelligence, Logic, Business Strategy, Workshops, Competitions, Networking, Learning, Community" />
      </Helmet>
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-32">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <motion.div 
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute left-[10%] top-[20%] -z-10 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[120px]"
          />
          <motion.div 
            animate={{ 
              x: [0, -100, 0],
              y: [0, 100, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute right-[10%] bottom-[20%] -z-10 h-[350px] w-[350px] rounded-full bg-highlight/20 blur-[120px]"
          />
          <motion.div 
            animate={{ 
              x: [0, 50, 0],
              y: [0, 50, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[300px] w-[300px] rounded-full bg-secondary/15 blur-[100px]"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          {/* Main Headline */}
          <motion.h1 
            initial={{ y: 40, opacity: 0, filter: 'blur(10px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-4 sm:mb-6 leading-none"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500">Appor</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-highlight">Leader</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 30, opacity: 0, filter: 'blur(10px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg sm:text-xl md:text-2xl text-gray-300 font-medium tracking-wide mb-6 sm:mb-8 max-w-3xl mx-auto"
          >
            Decoding Logic, Mastering AI, Winning the Game.
          </motion.p>
          
          <motion.p 
            initial={{ y: 20, opacity: 0, filter: 'blur(10px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed px-4 sm:px-0"
          >
            Join ApporLeader to decode logic, master AI, and win the game through interactive learning, global networking, and elite competitions.
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ y: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full max-w-md sm:max-w-none mx-auto"
          >
            <a 
              href="https://forms.gle/Wtbyryj5fe7vgLy56"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 font-bold text-black bg-btn rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,212,0,0.5)] w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center gap-2">
                Become a Member <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 ease-out group-hover:scale-100 group-hover:bg-white/20"></div>
            </a>
            <Link 
              to="/workshops" 
              className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 font-medium text-white border border-white/20 rounded-full transition-all hover:bg-white/10 hover:border-white/40 w-full sm:w-auto"
            >
              Explore Workshops
            </Link>
          </motion.div>

          {/* Floating Stats / Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 border-t border-white/10 pt-10 w-full max-w-4xl"
          >
            <div className="flex flex-col items-center justify-center">
              <h4 className="text-3xl md:text-4xl font-bold text-white mb-2"><AnimatedStat value={50} suffix="+" /></h4>
              <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wider">Workshops</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h4 className="text-3xl md:text-4xl font-bold text-white mb-2"><AnimatedStat value={24} suffix="/7" /></h4>
              <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wider">Community Access</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h4 className="text-3xl md:text-4xl font-bold text-white mb-2"><AnimatedStat value={100} suffix="%" /></h4>
              <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wider">Free to Join</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-[#050505] relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Our Core Segments</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Explore our diverse range of activities designed to sharpen your mind and accelerate your career.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className={`group relative p-8 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-${feature.color.split('-')[1]}/30 transition-colors overflow-hidden`}
              >
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                  <feature.icon size={120} className={feature.color} />
                </div>
                
                <div className={`w-14 h-14 rounded-xl ${feature.bg} flex items-center justify-center mb-6`}>
                  <feature.icon size={28} className={feature.color} />
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed mb-8">
                  {feature.description}
                </p>
                
                <Link to="/workshops" className="inline-flex items-center text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                  Explore <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
            
            {/* Join CTA Card */}
            <motion.div 
              variants={itemVariants}
              className="group relative p-8 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/5 border border-primary/20 flex flex-col justify-center items-center text-center overflow-hidden"
            >
              <h3 className="text-2xl font-bold mb-4 text-white">Ready to Level Up?</h3>
              <p className="text-gray-300 mb-8">Join thousands of members decoding logic and mastering AI.</p>
              <a 
                href="https://forms.gle/Wtbyryj5fe7vgLy56"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 font-bold text-black bg-btn rounded-full transition-transform hover:scale-105"
              >
                Join the Club
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] to-[#050505] z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Why Choose ApporLeader?</h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                We bridge the gap between theoretical knowledge and practical application. Our community is built on the foundation of continuous learning, logical thinking, and technological mastery.
              </p>
              
              <div className="space-y-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <benefit.icon size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{benefit.title}</h4>
                      <p className="text-gray-500">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square rounded-full bg-gradient-to-tr from-primary/20 via-highlight/10 to-transparent absolute -inset-4 blur-3xl -z-10"></div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#0a0a0a] rounded-xl p-6 border border-white/5">
                    <Calendar className="text-secondary mb-4" size={32} />
                    <h5 className="text-white font-bold text-lg mb-1">Weekly Events</h5>
                    <p className="text-sm text-gray-500">Live sessions & AMAs</p>
                  </div>
                  <div className="bg-[#0a0a0a] rounded-xl p-6 border border-white/5 mt-8">
                    <BrainCircuit className="text-primary mb-4" size={32} />
                    <h5 className="text-white font-bold text-lg mb-1">AI Challenges</h5>
                    <p className="text-sm text-gray-500">Test your prompting skills</p>
                  </div>
                  <div className="bg-[#0a0a0a] rounded-xl p-6 border border-white/5 -mt-8">
                    <Globe className="text-highlight mb-4" size={32} />
                    <h5 className="text-white font-bold text-lg mb-1">Global Reach</h5>
                    <p className="text-sm text-gray-500">Members from 50+ countries</p>
                  </div>
                  <div className="bg-[#0a0a0a] rounded-xl p-6 border border-white/5">
                    <Trophy className="text-btn mb-4" size={32} />
                    <h5 className="text-white font-bold text-lg mb-1">Tournaments</h5>
                    <p className="text-sm text-gray-500">Compete and win prizes</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Your Journey Section */}
      <section className="py-24 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Your Journey</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              A step-by-step path to mastering logic, AI, and leadership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {journeySteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative p-8 bg-[#050505] rounded-2xl border border-white/5 hover:border-primary/30 transition-colors"
              >
                <div className="text-5xl font-bold text-white/5 absolute top-4 right-4 pointer-events-none">
                  {step.step}
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Upcoming Events</h2>
              <p className="text-gray-400 text-lg max-w-2xl">
                Join our live sessions, workshops, and tournaments.
              </p>
            </div>
            <Link 
              to="/workshops" 
              className="inline-flex items-center text-primary hover:text-white transition-colors font-medium"
            >
              View All Events <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.slice(0, 3).map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden group hover:border-white/20 transition-colors"
              >
                <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                  <span className={`inline-block px-3 py-1 rounded-full ${event.bg} ${event.text} text-xs font-bold uppercase tracking-wider mb-4`}>
                    {event.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center text-gray-400">
                    <Calendar size={18} className="mr-3 text-gray-500" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Clock size={18} className="mr-3 text-gray-500" />
                    <span className="text-sm">{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <MapPin size={18} className="mr-3 text-gray-500" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
        {/* Parallax Background */}
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0 z-0 opacity-30 pointer-events-none"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-[10%] top-[20%] h-[300px] w-[300px] rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute right-[10%] bottom-[20%] h-[300px] w-[300px] rounded-full bg-highlight/20 blur-[100px]" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">What Our Members Say</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Don't just take our word for it. Hear from the people who have transformed their careers with us.
            </p>
          </div>

          <div className="relative flex overflow-hidden py-10 mask-image-linear-gradient">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none"></div>
            <motion.div
              className="flex gap-8 whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 30,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div
                  key={index}
                  className="w-[350px] flex-shrink-0 bg-[#0a0a0a] p-8 rounded-2xl border border-white/5 relative whitespace-normal flex flex-col justify-between"
                >
                  <div>
                    <Star className="text-btn mb-6" size={32} />
                    <p className="text-gray-300 mb-8 italic">"{testimonial.quote}"</p>
                  </div>
                  <div>
                    <h5 className="text-white font-bold">{testimonial.author}</h5>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-gray-400 text-lg">
              Everything you need to know about ApporLeader.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="border border-white/10 rounded-2xl bg-[#050505] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="text-lg font-medium text-white">{faq.question}</span>
                  <ChevronDown 
                    size={20} 
                    className={`text-gray-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-primary' : ''}`} 
                  />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-6 pt-0 text-gray-400 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full -z-10"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join the fastest growing community of logical thinkers, AI enthusiasts, and future leaders.
          </p>
          <a 
            href="https://forms.gle/Wtbyryj5fe7vgLy56"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-10 py-5 font-bold text-black bg-btn rounded-full text-lg transition-transform hover:scale-105 hover:shadow-[0_0_40px_rgba(255,212,0,0.4)]"
          >
            Become a Member Today
          </a>
        </div>
      </section>
    </div>
  );
}
