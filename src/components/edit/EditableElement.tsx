
import React, { useState, useEffect } from "react";
import { useEditMode } from "./EditModeProvider";
import { EditPopover } from "./EditPopover";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

interface EditableElementProps {
  id: string;
  type: "text" | "image" | "link" | "html";
  children: React.ReactNode;
  defaultContent?: string;
  className?: string;
  style?: React.CSSProperties; // Add style prop support
}

export const EditableElement: React.FC<EditableElementProps> = ({
  id,
  type,
  children,
  defaultContent,
  className = "",
  style = {},
}) => {
  const { isEditMode } = useEditMode();
  const location = useLocation();
  const [content, setContent] = useState<string>(defaultContent || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const pagePath = location.pathname;

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("editable_elements")
          .select("content")
          .eq("page_path", pagePath)
          .eq("element_id", id)
          .maybeSingle();

        if (error) {
          console.error("Erreur lors de la récupération du contenu:", error);
          return;
        }

        if (data) {
          setContent(data.content);
        } else if (defaultContent) {
          setContent(defaultContent);
        } else if (typeof children === "string") {
          setContent(children as string);
        }
      } catch (error) {
        console.error("Erreur inattendue:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [pagePath, id, defaultContent, children]);

  const saveContent = async (newContent: string) => {
    try {
      // Rechercher d'abord si l'élément existe déjà
      const { data: existingData, error: existingError } = await supabase
        .from("editable_elements")
        .select("id")
        .eq("page_path", pagePath)
        .eq("element_id", id)
        .maybeSingle();

      if (existingError) {
        throw existingError;
      }

      let result;
      if (existingData) {
        // Mettre à jour l'élément existant
        result = await supabase
          .from("editable_elements")
          .update({ content: newContent, updated_at: new Date().toISOString() })
          .eq("id", existingData.id);
      } else {
        // Créer un nouvel élément
        result = await supabase.from("editable_elements").insert({
          page_path: pagePath,
          element_id: id,
          element_type: type,
          content: newContent,
        });
      }

      if (result.error) {
        throw result.error;
      }

      setContent(newContent);
      toast({
        title: "Contenu mis à jour",
        description: "Les modifications ont été enregistrées avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du contenu:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les modifications.",
        variant: "destructive",
      });
    }
  };

  const handleEditStart = () => {
    if (isEditMode) {
      setIsEditing(true);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleEditSave = (newContent: string) => {
    saveContent(newContent);
    setIsEditing(false);
  };

  if (isLoading) {
    return <div className={className} style={style}>{children}</div>;
  }

  if (isEditing) {
    return (
      <EditPopover
        content={content}
        type={type}
        onSave={handleEditSave}
        onCancel={handleEditCancel}
        className={className}
        style={style}
      />
    );
  }

  // Rendu différent selon le type d'élément
  let renderedContent: React.ReactNode = children;

  if (content) {
    if (type === "text") {
      renderedContent = content;
    } else if (type === "image" && content) {
      renderedContent = <img src={content} alt="Editable content" className={className} style={style} />;
    } else if (type === "html") {
      renderedContent = <div dangerouslySetInnerHTML={{ __html: content }} style={style} />;
    } else if (type === "link") {
      // Pour un lien, on suppose que le contenu est une URL et on garde le texte des enfants
      renderedContent = (
        <a href={content} className={className} style={style}>
          {children}
        </a>
      );
    }
  }

  return (
    <div
      className={`${className} ${
        isEditMode ? "cursor-pointer hover:outline hover:outline-2 hover:outline-offset-2 hover:outline-blue-500" : ""
      }`}
      onClick={isEditMode ? handleEditStart : undefined}
      style={style}
    >
      {renderedContent}
    </div>
  );
};
