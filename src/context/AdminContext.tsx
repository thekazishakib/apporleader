import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { events as initialEvents } from '../data/events';
import { db, auth } from '../firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';

interface Member {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  gmail?: string;
  isEx?: boolean;
  isPermanent?: boolean;
}

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  credit?: string;
}

interface EventItem {
  id: number | string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  spots: number;
  filled: number;
  color: string;
  bg: string;
  text: string;
  image?: string;
  registrationLink?: string;
}

interface BlogItem {
  id: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
}

interface AdminContextType {
  isAdmin: boolean;
  login: () => Promise<boolean>;
  logout: () => void;
  members: Member[];
  setMembers: (members: Member[]) => void;
  leadershipTeam: Member[];
  setLeadershipTeam: (team: Member[]) => void;
  gallery: GalleryItem[];
  setGallery: (items: GalleryItem[]) => void;
  events: EventItem[];
  setEvents: (events: EventItem[]) => void;
  blogs: BlogItem[];
  setBlogs: (blogs: BlogItem[]) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const initialMembers: Member[] = [];

const initialLeadershipTeam: Member[] = [
  {
    id: '1',
    name: 'Kazi Shakib',
    role: 'Co-Founder & President',
    image: 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23111111"/%3E%3C/svg%3E',
    bio: 'Leading the vision and strategy for ApporLeader. Passionate about AI and logical frameworks.',
    website: 'https://kazishakib.com',
    github: 'https://github.com/thekazishakib',
    linkedin: 'https://linkedin.com/in/thekazishakib',
    isPermanent: true,
  },
  {
    id: '2',
    name: 'Nusrat Jahan',
    role: 'Co-Founder & Vice President',
    image: 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23111111"/%3E%3C/svg%3E',
    bio: 'Driving operations and community growth. Dedicated to empowering members through strategic initiatives.',
    website: 'https://thenusratjahan.com',
    isPermanent: true,
  }
];

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [members, setMembersState] = useState<Member[]>([]);
  const [leadershipTeam, setLeadershipTeamState] = useState<Member[]>([]);
  const [gallery, setGalleryState] = useState<GalleryItem[]>([]);
  const [events, setEventsState] = useState<EventItem[]>([]);
  const [blogs, setBlogsState] = useState<BlogItem[]>([]);
  const migrationRun = useRef(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      if (user && user.email === adminEmail) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    const unsubMembers = onSnapshot(collection(db, 'members'), (snapshot) => {
      setMembersState(snapshot.docs.map(doc => doc.data() as Member));
    });

    const unsubLeadership = onSnapshot(collection(db, 'leadership'), (snapshot) => {
      setLeadershipTeamState(snapshot.docs.map(doc => doc.data() as Member));
    });

    const unsubGallery = onSnapshot(collection(db, 'gallery'), (snapshot) => {
      setGalleryState(snapshot.docs.map(doc => doc.data() as GalleryItem));
    });

    const unsubEvents = onSnapshot(collection(db, 'events'), (snapshot) => {
      setEventsState(snapshot.docs.map(doc => doc.data() as EventItem));
    });

    const unsubBlogs = onSnapshot(collection(db, 'blogs'), (snapshot) => {
      setBlogsState(snapshot.docs.map(doc => doc.data() as BlogItem));
    });

    return () => {
      unsubscribeAuth();
      unsubMembers();
      unsubLeadership();
      unsubGallery();
      unsubEvents();
      unsubBlogs();
    };
  }, []);

  const syncCollection = async (collectionName: string, currentItems: any[], newItems: any[]) => {
    if (!isAdmin) return;
    
    const deleted = currentItems.filter(item => !newItems.find(n => n.id.toString() === item.id.toString()));
    const added = newItems.filter(item => !currentItems.find(c => c.id.toString() === item.id.toString()));
    const updated = newItems.filter(item => {
      const old = currentItems.find(c => c.id.toString() === item.id.toString());
      return old && JSON.stringify(old) !== JSON.stringify(item);
    });

    try {
      for (const d of deleted) await deleteDoc(doc(db, collectionName, d.id.toString()));
      for (const a of added) await setDoc(doc(db, collectionName, a.id.toString()), a);
      for (const u of updated) await updateDoc(doc(db, collectionName, u.id.toString()), u);
    } catch (error) {
      console.error(`Error syncing ${collectionName}`);
      alert(`Failed to sync changes to database. Make sure you are logged in as admin.`);
    }
  };

  const setMembers = (newMembers: Member[]) => {
    setMembersState(newMembers);
    syncCollection('members', members, newMembers);
  };

  const setLeadershipTeam = (newTeam: Member[]) => {
    setLeadershipTeamState(newTeam);
    syncCollection('leadership', leadershipTeam, newTeam);
  };

  const setGallery = (newGallery: GalleryItem[]) => {
    setGalleryState(newGallery);
    syncCollection('gallery', gallery, newGallery);
  };

  const setEvents = (newEvents: EventItem[]) => {
    setEventsState(newEvents);
    syncCollection('events', events, newEvents);
  };

  const setBlogs = (newBlogs: BlogItem[]) => {
    setBlogsState(newBlogs);
    syncCollection('blogs', blogs, newBlogs);
  };

  useEffect(() => {
    if (!isAdmin || migrationRun.current) return;

    const migrateData = async () => {
      try {
        // Cleanup duplicates: if a member exists in leadership, remove them from members
        if (leadershipTeam.length > 0 && members.length > 0) {
          const duplicateIds = members.filter(m => leadershipTeam.find(l => l.id === m.id)).map(m => m.id);
          if (duplicateIds.length > 0) {
            for (const id of duplicateIds) {
              await deleteDoc(doc(db, 'members', id.toString()));
            }
          }
        }

        const localMembers = localStorage.getItem('apporleader_members');
        if (members.length === 0) {
          if (localMembers) {
            const parsed = JSON.parse(localMembers);
            if (parsed.length > 0) setMembers(parsed.map((e: any) => ({ ...e, id: e.id.toString() })));
          } else {
            setMembers(initialMembers.map(e => ({ ...e, id: e.id.toString() })));
          }
        }

        const localLeadership = localStorage.getItem('apporleader_leadership');
        if (leadershipTeam.length === 0) {
          if (localLeadership) {
            const parsed = JSON.parse(localLeadership);
            if (parsed.length > 0) setLeadershipTeam(parsed.map((e: any) => ({ ...e, id: e.id.toString() })));
          } else {
            setLeadershipTeam(initialLeadershipTeam.map(e => ({ ...e, id: e.id.toString() })));
          }
        }

        const localGallery = localStorage.getItem('apporleader_gallery');
        if (localGallery && gallery.length === 0) {
          const parsed = JSON.parse(localGallery);
          if (parsed.length > 0) setGallery(parsed.map((e: any) => ({ ...e, id: e.id.toString() })));
        }

        const localEvents = localStorage.getItem('apporleader_events');
        if (events.length === 0) {
          if (localEvents) {
            const parsed = JSON.parse(localEvents);
            if (parsed.length > 0) {
              setEvents(parsed.map((e: any) => ({ 
                ...e, 
                id: e.id.toString(),
                spots: e.spots != null && !isNaN(Number(e.spots)) ? Number(e.spots) : 0,
                filled: e.filled != null && !isNaN(Number(e.filled)) ? Number(e.filled) : 0
              })));
            }
          } else {
            setEvents(initialEvents.map(e => ({ ...e, id: e.id.toString() })));
          }
        }

        const localBlogs = localStorage.getItem('apporleader_blogs');
        if (blogs.length === 0) {
          if (localBlogs) {
            const parsed = JSON.parse(localBlogs);
            if (parsed.length > 0) setBlogs(parsed.map((e: any) => ({ ...e, id: e.id.toString() })));
          } else {
            setBlogs([{
              id: 'sample-blog-1',
              title: 'The Future of AI in Strategic Decision Making',
              date: 'March 11, 2026',
              image: 'https://picsum.photos/seed/ai-strategy/800/400',
              excerpt: 'Exploring how artificial intelligence is reshaping the landscape of strategic business decisions.',
              content: 'Artificial Intelligence is no longer just a buzzword; it\'s a fundamental shift in how we approach complex problems. In this post, we delve into the intersection of AI and strategic planning, analyzing how data-driven insights are empowering leaders to make more informed, accurate, and forward-thinking decisions. From predictive analytics to automated risk assessment, the tools at our disposal are evolving rapidly. Understanding these tools is key to maintaining a competitive edge in an increasingly volatile market.'
            }]);
          }
        }
        
        migrationRun.current = true;
      } catch (e) {
        console.error('Migration error occurred');
      }
    };

    // Small delay to ensure Firebase data has loaded first
    const timer = setTimeout(migrateData, 2000);
    return () => clearTimeout(timer);
  }, [isAdmin, members.length, leadershipTeam.length, gallery.length, events.length, blogs.length]);

  const login = async () => {
    try {
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        login_hint: adminEmail
      });
      const result = await signInWithPopup(auth, provider);
      if (result.user.email === adminEmail) {
        setIsAdmin(true);
        return true;
      } else {
        await signOut(auth);
        return false;
      }
    } catch (error) {
      console.error('Login error occurred');
      throw new Error('Authentication failed');
    }
  };

  const logout = async () => {
    await signOut(auth);
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ 
      isAdmin, login, logout, 
      members, setMembers, 
      leadershipTeam, setLeadershipTeam, 
      gallery, setGallery, 
      events, setEvents, 
      blogs, setBlogs 
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
