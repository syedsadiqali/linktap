"use client";

import { SortableList } from "@/components/SortableList";
import { LinkCard } from "@/components/link-card";
import { updateSortingOrder } from "@/lib/db/user";
import { LinksRow } from "@/types/utils";
import { useCallback, useEffect, useState } from "react";

export default function LinksList({ links, setLinks }: any) {
  return (
    <SortableList<LinksRow>
      items={links}
      onChange={async (items) => {
        let ab = items.map((a) => a.id);

        setLinks(items);

        await updateSortingOrder(ab);
      }}
      renderItem={(item) => (
        <SortableList.Item id={item.id}>
          <LinkCard isEditable={true} link={item} key={item.id} />
        </SortableList.Item>
      )}
    />
  );
}
