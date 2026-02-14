'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';

interface KnowledgeDocumentProps {
    knowledge: any;
}

export default function KnowledgeDocument({ knowledge }: KnowledgeDocumentProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Render LaTeX equations
        if (contentRef.current) {
            const mathElements = contentRef.current.querySelectorAll('.math');
            mathElements.forEach((element) => {
                const latex = element.textContent || '';
                try {
                    katex.render(latex, element as HTMLElement, {
                        throwOnError: false,
                        displayMode: element.classList.contains('display'),
                    });
                } catch (error) {
                    console.error('LaTeX render error:', error);
                }
            });
        }
    }, [knowledge]);

    if (!knowledge) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-400">No knowledge document available</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2" ref={contentRef}>
            <h2 className="text-2xl font-bold mb-4">Lecture Notes</h2>

            {/* Summary */}
            {knowledge.summary && (
                <div className="card bg-dark-800">
                    <h3 className="text-lg font-semibold mb-2 text-primary-400">Summary</h3>
                    <p className="text-gray-300">{knowledge.summary}</p>
                </div>
            )}

            {/* Key Definitions */}
            {knowledge.key_definitions && knowledge.key_definitions.length > 0 && (
                <div className="card bg-dark-800">
                    <h3 className="text-lg font-semibold mb-2 text-primary-400">Key Definitions</h3>
                    <ul className="list-disc list-inside space-y-1">
                        {knowledge.key_definitions.map((def: string, index: number) => (
                            <li key={index} className="text-gray-300">{def}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Sections */}
            {knowledge.sections && knowledge.sections.map((section: any, sIndex: number) => (
                <div key={sIndex} className="card bg-dark-800">
                    <h3 className="text-xl font-semibold mb-3 text-primary-300">
                        {section.title}
                    </h3>

                    {/* Concepts */}
                    {section.concepts && section.concepts.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-400 mb-2">Concepts</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {section.concepts.map((concept: string, cIndex: number) => (
                                    <li key={cIndex} className="text-gray-300">{concept}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Equations */}
                    {section.equations_latex && section.equations_latex.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-400 mb-2">Equations</h4>
                            <div className="space-y-2">
                                {section.equations_latex.map((equation: string, eIndex: number) => (
                                    <div
                                        key={eIndex}
                                        className="math display bg-dark-900 p-3 rounded overflow-x-auto"
                                    >
                                        {equation}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Student Questions */}
                    {section.student_questions && section.student_questions.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-400 mb-2">Student Questions</h4>
                            <ul className="space-y-2">
                                {section.student_questions.map((question: string, qIndex: number) => (
                                    <li key={qIndex} className="text-gray-300 italic border-l-2 border-primary-500 pl-3">
                                        "{question}"
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Clarifications */}
                    {section.clarifications && section.clarifications.length > 0 && (
                        <div>
                            <h4 className="text-sm font-semibold text-gray-400 mb-2">Clarifications</h4>
                            <ul className="space-y-1">
                                {section.clarifications.map((clarification: string, clIndex: number) => (
                                    <li key={clIndex} className="text-gray-300">{clarification}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
