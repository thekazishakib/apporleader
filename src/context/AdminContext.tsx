import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { events as initialEvents } from '../data/events';
import { supabase } from '../supabase';
import {
  SiteSettings,
  DEFAULT_SITE_SETTINGS,
  rowsToSiteSettings,
  siteSettingsToUpserts,
} from '../config/siteSettingsMap';

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

interface VideoItem {
  id: string;
  title: string;
  url: string;
}

interface AdminContextType {
  isAdmin: boolean;
  authReady: boolean;
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
  videos: VideoItem[];
  setVideos: (videos: VideoItem[]) => void;
  // Site-wide settings (dynamic CMS)
  siteSettings: SiteSettings;
  updateSiteSettings: (patch: Partial<SiteSettings>) => Promise<void>;
  // Backward-compat shortcut
  membershipUrl: string;
  setMembershipUrl: (url: string) => Promise<void>;
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
  const [authReady, setAuthReady] = useState(false);
  const [members, setMembersState] = useState<Member[]>([]);
  const [leadershipTeam, setLeadershipTeamState] = useState<Member[]>([]);
  const [gallery, setGalleryState] = useState<GalleryItem[]>([]);
  const [events, setEventsState] = useState<EventItem[]>([]);
  const [blogs, setBlogsState] = useState<BlogItem[]>([]);
  const [videos, setVideosState] = useState<VideoItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const migrationRun = useRef(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Backward-compat shortcut
  const membershipUrl = siteSettings.membershipUrl;

  const fetchAllData = async () => {
    const [membersRes, leadershipRes, galleryRes, eventsRes, blogsRes, settingsRes, videosRes] = await Promise.all([
      supabase.from('members').select('*'),
      supabase.from('leadership').select('*'),
      supabase.from('gallery').select('*'),
      supabase.from('events').select('*'),
      supabase.from('blogs').select('*'),
      supabase.from('settings').select('*'),
      supabase.from('videos').select('*'),
    ]);
    setMembersState(membersRes.data || []);
    setLeadershipTeamState(leadershipRes.data || []);
    setGalleryState(galleryRes.data || []);
    setEventsState(eventsRes.data || []);
    setBlogsState(blogsRes.data || []);
    setVideosState(videosRes.data || []);

    if (settingsRes.data && settingsRes.data.length > 0) {
      setSiteSettings(rowsToSiteSettings(settingsRes.data));
    }

    setDataLoaded(true);
  };

  const updateSiteSettings = async (patch: Partial<SiteSettings>) => {
    const updated = { ...siteSettings, ...patch };
    setSiteSettings(updated);
    const upserts = siteSettingsToUpserts(patch);
    if (upserts.length > 0) {
      await supabase.from('settings').upsert(upserts, { onConflict: 'key' });
    }
  };

  // Backward compat
  const setMembershipUrl = async (url: string) => {
    await updateSiteSettings({ membershipUrl: url });
  };

  useEffect(() => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

    supabase.auth.exchangeCodeForSession(window.location.href).catch(() => {});

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email === adminEmail) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setAuthReady(true);
    });

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.email === adminEmail) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setAuthReady(true);
    });

    fetchAllData();

    const channel = supabase
      .channel('db-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, async () => {
        const { data } = await supabase.from('members').select('*');
        setMembersState(data || []);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leadership' }, async () => {
        const { data } = await supabase.from('leadership').select('*');
        setLeadershipTeamState(data || []);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery' }, async () => {
        const { data } = await supabase.from('gallery').select('*');
        setGalleryState(data || []);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, async () => {
        const { data } = await supabase.from('events').select('*');
        setEventsState(data || []);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, async () => {
        const { data } = await supabase.from('blogs').select('*');
        setBlogsState(data || []);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'videos' }, async () => {
        const { data } = await supabase.from('videos').select('*');
        setVideosState(data || []);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, async () => {
        const { data } = await supabase.from('settings').select('*');
        if (data && data.length > 0) setSiteSettings(rowsToSiteSettings(data));
      })
      .subscribe();

    return () => {
      authSubscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  const syncCollection = async (collectionName: string, currentItems: unknown[], newItems: unknown[]) => {
    if (!isAdmin) return;
    const deleted = (currentItems as { id: string }[]).filter(
      item => !(newItems as { id: string }[]).find(n => n.id.toString() === item.id.toString())
    );
    try {
      if (deleted.length > 0) {
        const { error } = await supabase
          .from(collectionName)
          .delete()
          .in('id', deleted.map(d => d.id.toString()));
        if (error) throw error;
      }
      if (newItems.length > 0) {
        const { error } = await supabase
          .from(collectionName)
          .upsert(newItems, { onConflict: 'id' });
        if (error) throw error;
      }
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

  const setVideos = (newVideos: VideoItem[]) => {
    setVideosState(newVideos);
    syncCollection('videos', videos, newVideos);
  };

  useEffect(() => {
    if (!isAdmin || !dataLoaded || migrationRun.current) return;

    const migrateData = async () => {
      try {
        if (leadershipTeam.length > 0 && members.length > 0) {
          const duplicates = members.filter(m => leadershipTeam.find(l => l.id === m.id));
          if (duplicates.length > 0) {
            await supabase.from('members').delete().in('id', duplicates.map(d => d.id));
          }
        }

        const localMembers = localStorage.getItem('apporleader_members');
        if (members.length === 0) {
          if (localMembers) {
            const parsed = JSON.parse(localMembers);
            if (parsed.length > 0) setMembers(parsed.map((e: Member) => ({ ...e, id: e.id.toString() })));
          } else {
            setMembers(initialMembers.map(e => ({ ...e, id: e.id.toString() })));
          }
        }

        const localLeadership = localStorage.getItem('apporleader_leadership');
        if (leadershipTeam.length === 0) {
          if (localLeadership) {
            const parsed = JSON.parse(localLeadership);
            if (parsed.length > 0) setLeadershipTeam(parsed.map((e: Member) => ({ ...e, id: e.id.toString() })));
          } else {
            setLeadershipTeam(initialLeadershipTeam.map(e => ({ ...e, id: e.id.toString() })));
          }
        }

        const localGallery = localStorage.getItem('apporleader_gallery');
        if (localGallery && gallery.length === 0) {
          const parsed = JSON.parse(localGallery);
          if (parsed.length > 0) setGallery(parsed.map((e: GalleryItem) => ({ ...e, id: e.id.toString() })));
        }

        const localEvents = localStorage.getItem('apporleader_events');
        if (events.length === 0) {
          if (localEvents) {
            const parsed = JSON.parse(localEvents);
            if (parsed.length > 0) {
              setEvents(parsed.map((e: EventItem) => ({
                ...e,
                id: e.id.toString(),
                spots: e.spots != null && !isNaN(Number(e.spots)) ? Number(e.spots) : 0,
                filled: e.filled != null && !isNaN(Number(e.filled)) ? Number(e.filled) : 0,
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
            if (parsed.length > 0) setBlogs(parsed.map((e: BlogItem) => ({ ...e, id: e.id.toString() })));
          } else {
            setBlogs([{
              id: 'sample-blog-1',
              title: 'The Future of AI in Strategic Decision Making',
              date: 'March 11, 2026',
              image: 'https://picsum.photos/seed/ai-strategy/800/400',
              excerpt: 'Exploring how artificial intelligence is reshaping the landscape of strategic business decisions.',
              content: 'Artificial Intelligence is no longer just a buzzword; it\'s a fundamental shift in how we approach complex problems.',
            }]);
          }
        }

        migrationRun.current = true;
      } catch (e) {
        console.error('Migration error occurred');
      }
    };

    const timer = setTimeout(migrateData, 1000);
    return () => clearTimeout(timer);
  }, [isAdmin, dataLoaded]);

  const login = async () => {
    try {
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: { login_hint: adminEmail },
        },
      });
      if (error) throw new Error('Authentication failed');
      return true;
    } catch (error) {
      console.error('Login error occurred');
      throw new Error('Authentication failed');
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{
      isAdmin, authReady, login, logout,
      members, setMembers,
      leadershipTeam, setLeadershipTeam,
      gallery, setGallery,
      events, setEvents,
      blogs, setBlogs,
      videos, setVideos,
      siteSettings, updateSiteSettings,
      membershipUrl, setMembershipUrl,
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