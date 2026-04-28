import { motion } from 'framer-motion';
import { Target, Eye, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="section-container py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Bridging Clinical Care & <br/>Digital Innovation</h1>
          <p className="text-lg text-brand-gray leading-relaxed">
            DTECHNURSE was founded on a simple truth: the most powerful technology in healthcare is only as good as the nurse using it. We exist to ensure no nurse is left behind in the digital revolution.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {[
            { icon: Target, title: "Our Mission", text: "To democratize health tech education for nurses globally, providing the skills needed to lead technological change in clinical environments." },
            { icon: Eye, title: "Our Vision", text: "A healthcare system where every nurse is a confident, empowered digital advocate, shaping the tools that impact patient outcomes." },
            { icon: Users, title: "Our Audience", text: "We serve student nurses, seasoned RNs, nurse leaders, and healthcare professionals looking to pivot into health-tech roles." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-brand-light p-8 rounded-2xl text-center"
            >
              <item.icon className="w-10 h-10 text-brand-blue mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-brand-gray text-sm leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
          }
