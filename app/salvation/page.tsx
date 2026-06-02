export default function SalvationPage() {
  const sections = [
    {
      title: "Questions Christians Often Ask",
      items: [
        {
          q: "How do I know I’m really saved?",
          a: "Salvation is based on faith in Jesus Christ, not feelings. Assurance comes from trusting God’s promise, not emotional certainty.",
          verses: [
            "John 3:16 — Whoever believes in Him shall not perish but have eternal life.",
            "Romans 10:9 — If you confess with your mouth Jesus is Lord and believe in your heart… you will be saved.",
            "1 John 5:13 — These things are written so that you may KNOW you have eternal life."
          ],
          context:
            "John and 1 John were written to believers to give assurance that salvation is secure in Christ, not based on fluctuating emotions."
        },

        {
          q: "Can I lose my salvation?",
          a: "Jesus teaches that salvation is held by God’s power, not human effort. True believers are kept by Him.",
          verses: [
            "John 10:28 — No one will snatch them out of My hand.",
            "Ephesians 1:13–14 — You were sealed with the Holy Spirit.",
            "Romans 8:38–39 — Nothing can separate us from the love of God."
          ],
          context:
            "Paul writes in Romans that nothing external or internal can break God’s saving grip on believers."
        },

        {
          q: "What if I keep struggling with the same sin?",
          a: "Believers still struggle with sin, but growth and conviction are signs of the Holy Spirit working in you.",
          verses: [
            "Romans 7:19 — For I do not do the good I want, but the evil I do not want is what I keep doing.",
            "1 John 1:9 — If we confess our sins, He is faithful to forgive.",
            "Philippians 1:6 — He who began a good work in you will carry it on."
          ],
          context:
            "Paul openly describes ongoing struggle with sin in the Christian life, showing sanctification is a process."
        },

        {
          q: "Am I saved by faith alone, or do works matter?",
          a: "We are saved by grace through faith, but true faith produces works as evidence.",
          verses: [
            "Ephesians 2:8–9 — Saved by grace through faith, not by works.",
            "James 2:17 — Faith without works is dead.",
            "Romans 3:28 — A person is justified by faith apart from works."
          ],
          context:
            "Paul explains justification by faith, while James addresses that genuine faith will naturally produce actions."
        },

        {
          q: "What does repentance actually mean?",
          a: "Biblical repentance means turning away from sin and turning toward God.",
          verses: [
            "Acts 3:19 — Repent and turn to God so that your sins may be wiped out.",
            "Luke 13:3 — Unless you repent, you will all likewise perish.",
            "2 Corinthians 7:10 — Godly sorrow brings repentance that leads to salvation."
          ],
          context:
            "Repentance in the New Testament is consistently described as a change of direction, not just emotion."
        },

        {
          q: "Do I have to be baptized to be saved?",
          a: "Salvation is through faith in Christ, though baptism is an important act of obedience.",
          verses: [
            "Ephesians 2:8–9 — Saved by grace through faith.",
            "Mark 16:16 — Whoever believes and is baptized will be saved.",
            "Acts 10:47–48 — The Holy Spirit came before baptism."
          ],
          context:
            "Acts shows Cornelius receiving the Holy Spirit before baptism, showing faith precedes outward obedience."
        }
      ]
    },

    {
      title: "Questions Non-Christians Often Ask",
      items: [
        {
          q: "Why does God require Jesus for salvation?",
          a: "The Bible teaches that Jesus is the only mediator who bridges humanity and God because He alone paid for sin.",
          verses: [
            "John 14:6 — I am the way, the truth, and the life.",
            "1 Timothy 2:5 — There is one mediator between God and mankind.",
            "Romans 5:8 — While we were still sinners, Christ died for us."
          ],
          context:
            "The New Testament consistently presents Jesus’ death as the atoning sacrifice that reconciles humanity to God."
        },

        {
          q: "Why would a loving God send people to hell?",
          a: "The Bible teaches that God offers salvation, but people are accountable for rejecting it.",
          verses: [
            "2 Peter 3:9 — God is patient, not wanting anyone to perish.",
            "John 3:18 — Whoever does not believe is condemned already.",
            "Romans 6:23 — The wages of sin is death."
          ],
          context:
            "Judgment is presented alongside God’s desire for repentance—showing both justice and mercy."
        },

        {
          q: "What about people who never heard of Jesus?",
          a: "Scripture teaches God is just and will judge fairly, though salvation is still through Christ.",
          verses: [
            "Romans 1:20 — People are without excuse because of creation.",
            "Acts 17:27 — God is not far from any one of us.",
            "Genesis 18:25 — Will not the Judge of all the earth do right?"
          ],
          context:
            "Paul explains that God reveals Himself through creation, while still holding Christ as the means of salvation."
        },

        {
          q: "What exactly must a person do to be saved?",
          a: "The Bible gives a simple answer: believe in Jesus Christ as Lord and Savior.",
          verses: [
            "Acts 16:31 — Believe in the Lord Jesus and you will be saved.",
            "Romans 10:9 — Confess Jesus is Lord and believe in your heart.",
            "John 3:16 — Whoever believes in Him will have eternal life."
          ],
          context:
            "The core gospel message is repeatedly summarized as belief and trust in Christ."
        }
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-stone-950 text-white px-6 py-20">
      
      {/* HEADER */}
      <h1 className="text-4xl font-bold text-center mb-4">
        Salvation Questions & Answers
      </h1>

      <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
        Bible-based answers to the most common questions about salvation.
      </p>

      {/* SECTIONS */}
      <div className="max-w-4xl mx-auto space-y-12">

        {sections.map((section, i) => (
          <div key={i}>
            
            <h2 className="text-2xl font-bold mb-6 text-blue-300">
              {section.title}
            </h2>

            <div className="space-y-6">

              {section.items.map((item, j) => (
                <div
                  key={j}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
                >
                  
                  <h3 className="text-lg font-semibold mb-2">
                    {item.q}
                  </h3>

                  <p className="text-gray-300 mb-4">
                    {item.a}
                  </p>

                  <div className="text-sm text-gray-400 space-y-1 mb-4">
                    {item.verses.map((v, k) => (
                      <p key={k}>📖 {v}</p>
                    ))}
                  </div>

                  <p className="text-xs text-gray-500 italic">
                    Context: {item.context}
                  </p>

                </div>
              ))}

            </div>

          </div>
        ))}

      </div>

    </main>
  );
}