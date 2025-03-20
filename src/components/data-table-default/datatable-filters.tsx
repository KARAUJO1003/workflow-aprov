import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FilterIcon, FilterX } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
// import { DateTimePicker } from "../ui/datetime-picker";
import { isValid } from "date-fns";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTableFilters({ column }: { column: any }) {
  const { filterVariant, isActions, filterOptions } = column.columnDef.meta ?? {
    filterOptions: [],
  };
  const columnFilterValue = column.getFilterValue();
  // const hasFilters = column.getAllFilters().length > 0;
  const isActionsColumn = column.columnDef.meta?.isActions ?? false;
  // Se a coluna for do tipo "actions", renderiza apenas a `div`
  if (isActionsColumn || isActions || column.id === "actions") {
    return (
      <div className="!bg-muted mt-auto p-2 rounded-none w-full h-8"></div>
    );
  }

  if (filterVariant === "date") {
    const validDate = isValid(new Date(columnFilterValue));

    if (!validDate) {
      // column.setFilterValue(null);
      return (
        // <DateTimePicker
        //   value={new Date()}
        //   onChange={(date?: Date) => column.setFilterValue(date)}
        //   displayFormat={{ hour24: "dd/MM/yyyy" }}
        //   placeholder="Data de vazamento"
        //   className="bg-background h-8"
        //   granularity="day"
        //   locale={ptBR}
        // />
        <Input
          type="date"
          value={columnFilterValue}
          onChange={(e) => column.setFilterValue(e.target.value)}
        />
      );
    }

    return (
      <Input
        type="date"
        value={columnFilterValue}
        onChange={(e) => column.setFilterValue(e.target.value)}
      />
      // <DateTimePicker
      //   value={new Date(columnFilterValue)}
      //   onChange={(date?: Date) => column.setFilterValue(date)}
      //   displayFormat={{ hour24: "dd/MM/yyyy" }}
      //   placeholder="Data de vazamento"
      //   className="bg-background h-8"
      //   granularity="day"
      //   locale={ptBR}
      // />

      // <DateTimePicker
      //   selectedDate={columnFilterValue as Date}
      //   onChange={(date: Date) => column.setFilterValue(date)}
      //   className="bg-zinc-100 dark:bg-[#252b2e] border-none rounded-none outline-none focus-visible:ring-none focus-visible:ring-0 focus-visible:ring-offset-none w-full h-9"
      // />
    );
  }

  if (filterVariant === "range") {
    return (
      <div>
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue([
              value,
              (columnFilterValue as [number, number])?.[1],
            ])
          }
          placeholder="Min"
        />
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue([
              (columnFilterValue as [number, number])?.[0],
              value,
            ])
          }
          placeholder="Max"
        />
      </div>
    );
  }

  const facetedUniqueValues = column.getFacetedUniqueValues();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const sortedUniqueValues = React.useMemo(() => {
    const uniqueValues = Array.from(facetedUniqueValues.keys());

    // Ordena os valores com base no tipo
    const sorted = uniqueValues.sort((a, b) => {
      const aIsNumber =
        !isNaN(parseFloat(a as string)) && isFinite(a as number);
      const bIsNumber =
        !isNaN(parseFloat(b as string)) && isFinite(b as number);

      // Se ambos são números, ordena numericamente
      if (aIsNumber && bIsNumber) {
        return parseFloat(a as string) - parseFloat(b as string);
      }

      // Se ambos são strings, ou um é string e o outro número, ordena alfabeticamente
      return String(a).localeCompare(String(b));
    });

    return sorted.slice(0, 5000); // Limita o número de opções
  }, [facetedUniqueValues]);

  if (filterVariant === "select") {
    return (
      <Select
        onValueChange={(value) => {
          const newValue = value === "all" ? null : value;
          column.setFilterValue(newValue);
        }}
        value={columnFilterValue ?? ""}
      >
        <SelectTrigger className="border-none w-full h-8 font-normal">
          <SelectValue placeholder={`Selecionar...`} />
        </SelectTrigger>
        <SelectContent>
          {!filterOptions?.length && <SelectItem value="all">Todos</SelectItem>}
          {!filterOptions?.length &&
            sortedUniqueValues?.map((value) => (
              <SelectItem
                className="capitalize"
                value={String(value)}
                key={String(value)}
              >
                {String(value)}
              </SelectItem>
            ))}

          {filterOptions?.length > 0 &&
            filterOptions?.map((option: { label: string; value: string }) => (
              <SelectItem
                value={option.value || "all"}
                key={option.value || "all"}
              >
                {option.label || "Todos"}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      // <MultiSelect
      //   className="bg-transparent border-none rounded-none"
      //   maxCount={1}
      //   defaultValue={columnFilterValue ?? []}
      //   options={sortedUniqueValues.map((value) => ({
      //     value: String(value),
      //     label: String(value),
      //   }))}
      //   onValueChange={(values) => {
      //     column.setFilterValue(values.map((value) => value));
      //   }}
      // />
    );
  }

  if (filterVariant === "disabled") {
    return (
      <div className="group relative flex mt-auto w-full h-8">
        <Input
          type="text"
          disabled
          value={columnFilterValue ?? ""}
          onChange={(e) => column.setFilterValue(e.target.value)}
          className="bg-transparent focus-visible:bg-muted focus-visible:shadow-inner pr-0 border-none rounded-none outline-none focus-visible:ring-none focus-visible:ring-0 focus-visible:ring-offset-none w-full h-full font-normal"
        />
      </div>
    );
  }
  return (
    <div className="group relative flex mt-auto w-full h-8">
      <Input
        type="text"
        value={columnFilterValue ?? ""}
        onChange={(e) => column.setFilterValue(e.target.value)}
        placeholder="Filtrar..."
        className="focus-visible:!bg-input/50 !bg-transparent focus-visible:shadow-inner pr-0 border-none rounded-xs outline-none focus-visible:ring-none focus-visible:ring-0 focus-visible:ring-offset-none w-full h-full font-normal"
      />
      {!columnFilterValue && (
        <Button
          size="icon"
          variant="link"
          tabIndex={-1}
          className="top-1/2 -right-4 absolute text-muted-foreground/40 -translate-x-1/2 -translate-y-1/2 cursor-default no-select"
        >
          <FilterIcon
            className={cn(["size-3.5"], {
              "text-blue-500": columnFilterValue?.length > 0,
            })}
          />
        </Button>
      )}
      {columnFilterValue && (
        <Button
          className={cn(
            [
              "absolute hover:text-destructive text-muted-foreground -translate-y-1/2 -translate-x-1/2 top-1/2 -right-4",
            ],
            {
              "group-focus-within:text-red-500": columnFilterValue?.length > 0,
            }
          )}
          variant="ghost"
          size="icon"
          onClick={() => column.setFilterValue("")}
        >
          <FilterX className="size-3.5" />
        </Button>
      )}
    </div>
  );
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, onChange, debounce]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
