import { SortableList } from "@/components/SortableList";
import { LinkCard } from "@/components/link-card";
import { updateSortingOrder } from "@/server/actions/page";
import { LinksRow } from "@/types/utils";

export default function LinksList({ links, pageDetails, setLinks }: any) {
  return (
    <SortableList<LinksRow>
      items={links}
      onChange={async (items) => {
        let ab = items.map((a) => a.id);
        
        setLinks(items);

        await updateSortingOrder(ab, pageDetails.page_handle);
      }}
      renderItem={(item) => (
        <SortableList.Item id={item.id}>
          <LinkCard isEditable={true} link={item} key={item.id} />
        </SortableList.Item>
      )}
    />
  );
}
