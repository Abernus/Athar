"use client";

import { use } from "react";
import { useResearchStore } from "@/stores/research-store";
import { PageHeader, Badge, Card, CardSection } from "@/components/ui";
import { RelationshipList } from "@/components/entities";
import { PLACE_TYPE_LABELS } from "@/lib/constants";

export default function PlaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getPlaceById, getPlaceById: getParent } = useResearchStore();
  const place = getPlaceById(id);

  if (!place) {
    return (
      <div className="py-12 text-center text-sm text-[var(--color-ink-muted)]">
        Lieu non trouvé.
      </div>
    );
  }

  const parentPlace = place.parentPlaceId ? getParent(place.parentPlaceId) : undefined;

  return (
    <div>
      <PageHeader title={place.name} />

      <Card>
        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
          <div>
            <p className="text-[var(--color-ink-muted)] text-xs uppercase tracking-wide">Type</p>
            <p className="text-[var(--color-ink)]">{PLACE_TYPE_LABELS[place.placeType]}</p>
          </div>
          {parentPlace && (
            <div>
              <p className="text-[var(--color-ink-muted)] text-xs uppercase tracking-wide">Lieu parent</p>
              <p className="text-[var(--color-ink)]">{parentPlace.name}</p>
            </div>
          )}
        </div>

        {place.summary && (
          <p className="text-sm text-[var(--color-ink-secondary)] leading-relaxed">{place.summary}</p>
        )}

        {place.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {place.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </Card>

      <CardSection title="Relations">
        <Card>
          <RelationshipList entityType="place" entityId={place.id} />
        </Card>
      </CardSection>

      {place.notes && (
        <CardSection title="Notes">
          <Card>
            <p className="text-sm text-[var(--color-ink-secondary)] whitespace-pre-wrap">{place.notes}</p>
          </Card>
        </CardSection>
      )}
    </div>
  );
}
