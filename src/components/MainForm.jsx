import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LayoutList, Layers, Send, CheckCircle2, X, ArrowUpRight } from 'lucide-react';
import { TextInput, TextArea, CheckboxGroup, cn } from './FormInputs';

import gifSynapse from '../assets/Gif_synapse.mp4';
import gifSynapseWebm from '../assets/Gif_synapse.webm';
import imgWebDev from '../assets/web_development_1780904007038.png';
import imgAi from '../assets/ai_machine_learning_1780904019865.png';
import imgSystems from '../assets/systems_programming_1780904031735.png';
import imgOpenSource from '../assets/open_source_1780904045447.png';
import imgEvent from '../assets/event_management_1780904058528.png';

import imgStructured from '../assets/structured_projects_1780904084249.png';
import imgOpenLearning from '../assets/open_learning_1780904094970.png';
import imgWorkshops from '../assets/workshops_guest_lectures_1780904107273.png';
import imgPeerDesktop from '../assets/Peer_2_Peer.png';
import imgWorkshopsDesktop from '../assets/workshops_&_lectures.png';

const INTEREST_OPTIONS = [
  { value: 'Web Development (React, UI/UX, Animations)', label: 'Web Development', image: imgWebDev, bentoClass: 'area-web' },
  { value: 'AI & Machine Learning (Edge-AI, Deep Learning)', label: 'AI & Machine Learning', image: imgAi, bentoClass: 'area-ai' },
  { value: 'Systems Programming (C++)', label: 'Systems Programming', image: imgSystems, bentoClass: 'area-sys' },
  { value: 'Open Source Contribution', label: 'Open Source', image: imgOpenSource, bentoClass: 'area-open' },
  { value: 'Event Management / Leadership', label: 'Event Management', image: imgEvent, bentoClass: 'area-event' },
  { value: 'Other', label: 'Other (Specify)', image: null, bentoClass: 'area-other bg-zinc-800' }
];

const COLLAB_OPTIONS = [
  { value: 'I prefer structured, project-based groups (like our Squads and Sprints).', label: 'Structured & Project-Based', image: imgStructured, bentoClass: 'area-struct' },
  { value: 'I prefer open-ended peer-to-peer learning and mentoring.', label: 'Peer-to-peer Mentoring', image: imgOpenLearning, desktopImage: imgPeerDesktop, bentoClass: 'area-peer' },
  { value: 'I prefer attending workshops and guest lectures.', label: 'Workshops & Lectures', image: imgWorkshops, desktopImage: imgWorkshopsDesktop, bentoClass: 'area-work' },
  { value: 'Other', label: 'Other (Specify)', image: null, bentoClass: 'area-collab-other bg-zinc-800' }
];

const INITIAL_DATA = {
  fullName: '',
  uid: '',
  email: '',
  course: '',
  whatsapp: '',
  interests: [],
  interestsOther: '',
  collab: [],
  collabOther: '',
  expUniv: '',
  expSynapse: '',
  ideas: ''
};

const ParticleBackground = () => {
  // Generate 40 random glowing particles, memoized so they don't respawn on render
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      const size = Math.random() * 4 + 2; // 2px to 6px
      const left = Math.random() * 100; // 0% to 100% width
      const animationDuration = Math.random() * 15 + 10; // 10s to 25s
      const animationDelay = Math.random() * -20; // Start offset
      const isPurple = Math.random() > 0.4;

      return (
        <div
          key={i}
          className={cn(
            "absolute rounded-full animate-float-up",
            isPurple ? "bg-purple-500 shadow-[0_0_20px_4px_rgba(168,85,247,0.8)]" : "bg-blue-400 shadow-[0_0_20px_4px_rgba(96,165,250,0.8)]"
          )}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            bottom: '-10%',
            animationDuration: `${animationDuration}s`,
            animationDelay: `${animationDelay}s`,
          }}
        />
      );
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 mask-fade-bottom opacity-50">
      {particles}
    </div>
  );
};

const Reveal = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (ref.current) observer.unobserve(ref.current);
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${isVisible ? "opacity-100 translate-y-0 revealed" : "opacity-0 translate-y-12"
        }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function MainForm() {
  const [viewMode, setViewMode] = useState('strip'); // 'strip' or 'wizard'
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(prev => {
        if (!prev && window.scrollY > 80) return true;
        if (prev && window.scrollY < 20) return false;
        return prev;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  useEffect(() => {
    if (formData.interests.includes('Other') && !formData.interestsOther) {
      setActiveModal('interests');
    }
  }, [formData.interests]);

  useEffect(() => {
    if (formData.collab.includes('Other') && !formData.collabOther) {
      setActiveModal('collab');
    }
  }, [formData.collab]);

  const validateGroup1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.uid.trim()) newErrors.uid = 'UID is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'A valid email is required';
    }

    if (!formData.course.trim()) newErrors.course = 'Course & Year is required';

    if (!formData.whatsapp.trim() || !/^\d{10,}$/.test(formData.whatsapp)) {
      newErrors.whatsapp = 'Valid numeric WhatsApp number (min 10 digits) is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateGroup2 = () => {
    const newErrors = {};
    if (formData.interests.length === 0) newErrors.interests = 'Please select at least one interest';
    if (formData.interests.includes('Other') && !formData.interestsOther.trim()) {
      newErrors.interestsOther = 'Please specify your other interest below';
    }

    if (formData.collab.length === 0) newErrors.collab = 'Please select a collaboration preference';
    if (formData.collab.includes('Other') && !formData.collabOther.trim()) {
      newErrors.collabOther = 'Please specify your other preference below';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateGroup3 = () => {
    const newErrors = {};
    if (!formData.expUniv.trim()) newErrors.expUniv = 'This field is required';
    if (!formData.expSynapse.trim()) newErrors.expSynapse = 'This field is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateGroup1()) setStep(2);
    else if (step === 2 && validateGroup2()) setStep(3);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    const isG1Valid = validateGroup1();
    const isG2Valid = validateGroup2();
    const isG3Valid = validateGroup3();

    if (!isG1Valid || !isG2Valid || !isG3Valid) {
      if (viewMode === 'wizard') {
        if (!isG1Valid) setStep(1);
        else if (!isG2Valid) setStep(2);
        else setStep(3);
      }
      return;
    }

    setIsSubmitting(true);

    const payload = new URLSearchParams();
    payload.append('entry.1397498702', formData.fullName);
    payload.append('entry.1751509091', formData.uid);
    payload.append('entry.1105562094', formData.email);
    payload.append('entry.1295414584', formData.course);
    payload.append('entry.1959005397', formData.whatsapp);

    formData.interests.forEach(interest => {
      if (interest === 'Other') {
        payload.append('entry.34114088', '__other_option__');
        payload.append('entry.34114088.other_option_response', formData.interestsOther);
      } else {
        payload.append('entry.34114088', interest);
      }
    });

    formData.collab.forEach(pref => {
      if (pref === 'Other') {
        payload.append('entry.1125014313', '__other_option__');
        payload.append('entry.1125014313.other_option_response', formData.collabOther);
      } else {
        payload.append('entry.1125014313', pref);
      }
    });

    payload.append('entry.1614567446', formData.expUniv);
    payload.append('entry.33298898', formData.expSynapse);
    payload.append('entry.1229926781', formData.ideas);

    try {
      await fetch('https://docs.google.com/forms/d/e/1FAIpQLSfW5KJPnLjxvTToyy7ZDO42nsDz6VzrAXJTfckPHxViiAFpqg/formResponse', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload.toString(),
      });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ParticleBackground />
        <div className="relative z-10 text-center animate-fade-in glass-panel p-12 rounded-md max-w-lg w-full border border-purple-500/20">
          <CheckCircle2 className="w-20 h-20 text-purple-400 mx-auto mb-6 animate-soft-pulse rounded-full" />
          <h2 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-white to-purple-300 mb-4">Submission Successful</h2>
          <p className="text-zinc-400 font-light text-lg">Your application has been received by Synapse Society.</p>
        </div>
      </div>
    );
  }

  const renderGroup1 = () => (
    <Reveal delay={100}>
      <div className="space-y-6">
        <h3 className="text-2xl md:text-3xl font-medium text-white pb-3 mb-6 border-b border-white/10">Personal Information</h3>
        <TextInput
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={e => updateField('fullName', e.target.value)}
          error={errors.fullName}
          required
        />
        <TextInput
          label="UID"
          placeholder="e.g. 25LBCS1146"
          value={formData.uid}
          onChange={e => updateField('uid', e.target.value.toUpperCase())}
          error={errors.uid}
          required
        />
        <TextInput
          label="Personal Email Address"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={e => updateField('email', e.target.value)}
          error={errors.email}
          required
        />
        <TextInput
          label="Course & Year of Study"
          placeholder="e.g. B.Tech, 2nd Year"
          value={formData.course}
          onChange={e => updateField('course', e.target.value)}
          error={errors.course}
          required
        />
        <TextInput
          label="Contact Number (WhatsApp)"
          placeholder="10-digit number"
          type="tel"
          value={formData.whatsapp}
          onChange={e => updateField('whatsapp', e.target.value.replace(/\D/g, ''))}
          error={errors.whatsapp}
          required
        />
      </div>
    </Reveal>
  );

  const renderGroup2 = () => (
    <Reveal delay={200}>
      <div className="space-y-6 relative">
        <h3 className="text-2xl md:text-3xl font-medium text-white pb-3 mb-6 border-b border-white/10 flex justify-between items-center">
          <span>Area of Focus/Interest <span className="text-purple-400 text-base ml-1">*</span></span>
        </h3>
        <CheckboxGroup
          label=""
          options={INTEREST_OPTIONS}
          selectedValues={formData.interests}
          onChange={val => updateField('interests', val)}
          error={errors.interests}
          required
          variant="cards"
          gridClassName="grid-interests"
        />
        {formData.interests.includes('Other') && (
          <div className="mt-2 animate-slide-up">
            <TextInput
              label="Specify Other Interest"
              placeholder="Type it out here..."
              value={formData.interestsOther}
              onChange={e => updateField('interestsOther', e.target.value)}
              error={errors.interestsOther}
              required
              autoFocus
            />
          </div>
        )}

        <div className="pt-8">
          <h3 className="text-2xl md:text-3xl font-medium text-white pb-3 mb-6 border-b border-white/10 flex justify-between items-center">
            <span>Collaboration Preference <span className="text-purple-400 text-base ml-1">*</span></span>
          </h3>
          <CheckboxGroup
            label=""
            options={COLLAB_OPTIONS}
            selectedValues={formData.collab}
            onChange={val => updateField('collab', val)}
            error={errors.collab}
            required
            variant="cards"
            gridClassName="grid-collab"
          />
          {formData.collab.includes('Other') && (
            <div className="mt-2 animate-slide-up">
              <TextInput
                label="Specify Other Preference"
                placeholder="Type it out here..."
                value={formData.collabOther}
                onChange={e => updateField('collabOther', e.target.value)}
                error={errors.collabOther}
                required
                autoFocus
              />
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );

  const renderGroup3 = () => (
    <Reveal delay={300}>
      <div className="space-y-6">
        <h3 className="text-2xl md:text-3xl font-medium text-white pb-3 mb-6 border-b border-white/10">Expectations</h3>
        <TextArea
          label="What do you, as a student, expect from a university club/Society?"
          placeholder="What are you looking to gain?"
          value={formData.expUniv}
          onChange={e => updateField('expUniv', e.target.value)}
          error={errors.expUniv}
          required
        />
        <TextArea
          label="What specific outcomes or experiences do you expect Synapse Society to deliver?"
          placeholder="How can we help you grow?"
          value={formData.expSynapse}
          onChange={e => updateField('expSynapse', e.target.value)}
          error={errors.expSynapse}
          required
        />
        <TextArea
          label="Any additional ideas, suggestions, or projects you'd love to see happen in the Society?"
          placeholder="Any other thoughts? (Optional)"
          value={formData.ideas}
          onChange={e => updateField('ideas', e.target.value)}
        />
      </div>
    </Reveal>
  );

  return (
    <>
      <ParticleBackground />
      <div className="max-w-5xl mx-auto px-2 sm:px-4 md:px-8 py-4 md:py-8 relative z-10">
          <div className={cn(
            "sticky top-0 z-50 flex justify-between items-center mb-12 border-b border-white/5 bg-black/60 backdrop-blur-xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.8)] transition-all duration-500 rounded-b-2xl md:-mx-8 md:px-12",
            isScrolled ? "flex-row pb-2 pt-2 -mx-2 px-4 sm:-mx-4 sm:px-8 md:pb-6 md:pt-6" : "flex-col md:flex-row pb-6 pt-6 -mx-2 px-4 sm:-mx-4 sm:px-8"
          )}>
            <div className={cn("flex items-center text-center md:text-left transition-all duration-500", isScrolled ? "flex-row space-x-3 md:flex-col md:items-start md:space-x-0" : "flex-col md:items-start")}>
              <h1 className={cn("font-semibold text-white tracking-tight transition-all duration-500", isScrolled ? "text-2xl md:text-6xl" : "text-5xl md:text-6xl")}>Synapse Society</h1>
              <div className={cn("rounded-md shadow-[0_0_30px_rgba(147,51,234,0.3)] overflow-hidden transition-all duration-500", isScrolled ? "w-8 h-8 mt-0 mb-0 md:mt-6 md:mb-4 md:max-w-sm md:w-full md:h-auto" : "mt-6 mb-4 max-w-sm w-full")}>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full md:h-auto object-cover"
                >
                  <source src={gifSynapseWebm} type="video/webm" />
                  <source src={gifSynapse} type="video/mp4" />
                </video>
              </div>
              <p className={cn("text-zinc-400 font-light text-base md:text-lg tracking-wide transition-all duration-500", isScrolled ? "hidden md:block opacity-100" : "animate-fade-in")}>
                Recruitment Form &bull; 2026
              </p>
            </div>
  
            <div className={cn("flex justify-center md:justify-end transition-all duration-500", isScrolled ? "mt-0 md:mt-0" : "mt-8 md:mt-0")}>
              <div className="flex bg-white/5 p-1 rounded-md border border-white/10">
              <button
                type="button"
                onClick={() => setViewMode('strip')}
                className={cn("flex items-center rounded-md text-sm font-medium transition-all duration-300", isScrolled ? "p-2 md:px-4 md:py-2" : "px-4 py-2", viewMode === 'strip' ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300")}
              >
                <LayoutList className={cn("w-4 h-4", isScrolled ? "md:mr-2" : "mr-2")} />
                <span className={isScrolled ? "hidden md:inline" : ""}>Scroll View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('wizard')}
                className={cn("flex items-center rounded-md text-sm font-medium transition-all duration-300", isScrolled ? "p-2 md:px-4 md:py-2" : "px-4 py-2", viewMode === 'wizard' ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300")}
              >
                <Layers className={cn("w-4 h-4", isScrolled ? "md:mr-2" : "mr-2")} />
                <span className={isScrolled ? "hidden md:inline" : ""}>Step View</span>
              </button>
              </div>
            </div>
          </div>

        <form onSubmit={handleSubmit} className="relative z-10 glass-panel p-4 sm:p-6 md:p-8">
          {viewMode === 'strip' ? (
            <div className="space-y-12 pb-6">
              {renderGroup1()}
              {renderGroup2()}
              {renderGroup3()}
              <div className="pt-8 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative overflow-hidden flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-md transition-all duration-300 hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group border border-purple-400/30"
                >
                  <span className="relative z-10 flex items-center">
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    <Send className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="pb-6">
              <div className={cn(
                "flex justify-between relative z-40 transition-all duration-300",
                isScrolled
                  ? "sticky top-[68px] md:top-[88px] bg-black/80 backdrop-blur-xl py-4 -mx-4 px-6 sm:-mx-6 sm:px-8 md:-mx-8 md:px-10 border-b border-white/10 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.8)] rounded-b-2xl mb-8"
                  : "mb-14 px-2"
              )}>
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/5 -z-10 rounded-full mx-2 md:mx-6"></div>
                <div
                  className="absolute top-1/2 left-0 h-[2px] bg-purple-500 -z-10 transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(147,51,234,0.5)] rounded-full mx-2 md:mx-6"
                  style={{ width: `calc(${((step - 1) / 2) * 100}% - 1rem)` }}
                ></div>
                {[1, 2, 3].map(s => (
                  <div
                    key={s}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-500 border-2 bg-black",
                      step >= s ? "border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]" : "border-white/10 text-zinc-600"
                    )}
                  >
                    {s}
                  </div>
                ))}
              </div>

              <div className="min-h-[400px]">
                {step === 1 && renderGroup1()}
                {step === 2 && renderGroup2()}
                {step === 3 && renderGroup3()}
              </div>

              <div className="mt-12 pt-8 border-t border-white/10 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(prev => Math.max(1, prev - 1))}
                  className={cn(
                    "px-6 py-3 font-medium text-zinc-400 hover:text-white transition-all",
                    step === 1 ? "opacity-0 pointer-events-none" : "opacity-100"
                  )}
                >
                  Back
                </button>

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="group flex items-center px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 text-white rounded-md transition-all duration-300 font-medium backdrop-blur-md hover:shadow-[0_0_20px_rgba(147,51,234,0.2)]"
                  >
                    Next
                    <ArrowUpRight className="w-4 h-4 ml-2 transition-all duration-300 group-hover:rotate-45" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative overflow-hidden flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-md transition-all duration-300 hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group border border-purple-400/30"
                  >
                    <span className="relative z-10 flex items-center">
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                      <Send className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}
        </form>
      </div>

      {activeModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-zinc-900 border border-white/10 p-8 rounded-xl w-full max-w-md shadow-2xl animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-white">Please specify "Other"</h3>
              <button type="button" onClick={() => setActiveModal(null)} className="text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <TextInput
              label={activeModal === 'interests' ? "What's your interest?" : "What's your preference?"}
              placeholder="Type it out here..."
              value={activeModal === 'interests' ? formData.interestsOther : formData.collabOther}
              onChange={e => updateField(activeModal === 'interests' ? 'interestsOther' : 'collabOther', e.target.value)}
              autoFocus
            />

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full mt-6 bg-white text-black hover:bg-zinc-200 py-3 rounded-md font-medium transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
