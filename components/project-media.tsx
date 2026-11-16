"use client";

import { ArrowUpRight, Play, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { Project } from "@/lib/content";

export function ProjectMedia({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div
      className="project-visual project-visual--media"
      data-reveal-image
      suppressHydrationWarning
      style={{ aspectRatio: `${project.media.width} / ${project.media.height}` }}
    >
      <Image
        src={project.media.poster}
        alt=""
        fill
        sizes="(max-width: 900px) 100vw, (max-width: 1180px) 80vw, 780px"
        className="project-visual__image"
      />

      <span className="project-visual__shade" aria-hidden="true" />

      <div className="project-visual__meta">
        <span>{project.code}</span>
        <span>{project.media.duration ?? "Site"}</span>
      </div>

      {project.media.src ? (
        <button
          type="button"
          className="project-visual__play"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-label={`Ver o vídeo do projeto ${project.title}`}
        >
          <span className="project-visual__play-icon">
            <Play aria-hidden="true" />
          </span>
          <span>Ver vídeo</span>
        </button>
      ) : project.href ? (
        <a
          href={project.href}
          className="project-visual__play"
          target="_blank"
          rel="noreferrer"
          aria-label={`Abrir o projeto ${project.title} em nova aba`}
        >
          <span className="project-visual__play-icon">
            <ArrowUpRight aria-hidden="true" />
          </span>
          <span>Ver projeto</span>
        </a>
      ) : null}

      <dialog
        ref={dialogRef}
        className="project-dialog"
        onClose={close}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            close();
          }
        }}
        aria-labelledby={`${project.id}-video-title`}
      >
        {open ? (
          <div className="project-dialog__inner">
            <div className="project-dialog__head">
              <div>
                <p className="section-label">{project.category}</p>
                <h2 id={`${project.id}-video-title`}>{project.title}</h2>
              </div>

              <button
                type="button"
                className="project-dialog__close"
                onClick={close}
                aria-label="Fechar vídeo"
              >
                <X aria-hidden="true" />
              </button>
            </div>

            <div className="project-dialog__video-wrap">
              <video
                className="project-dialog__video"
                src={project.media.src}
                poster={project.media.poster}
                controls
                autoPlay
                muted
                playsInline
                preload="metadata"
                aria-label={`Vídeo do projeto ${project.title}`}
              />
            </div>

            <div className="project-dialog__foot">
              <p>{project.description}</p>

              <div className="project-dialog__foot-side">
                <ul className="tag-list" aria-label="Escopo do projeto">
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>

                {project.href ? (
                  <a
                    href={project.href}
                    className="link-arrow"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>Abrir site do projeto</span>
                    <ArrowUpRight className="icon-arrow" aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
