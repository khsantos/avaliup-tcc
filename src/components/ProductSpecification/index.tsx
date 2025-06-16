import { Card } from "../ui/card";

export default function ProductSpecification() {
    const specifications = [
        { label: "Sensor", value: "PAW3395" },
        { label: "Peso", value: "+-65g" },
        { label: "Conexão", value: "Cabeado - 2.4g - Bluetooth" },
        { label: "Polling rate", value: "Dongle 1000Hz / Dongle 4000Hz" },
        { label: "Switch", value: "TTC Gold 60M" },
        { label: "Bateria", value: "500mAh" },
    ];

    return (
        <div className="p-2 max-w-8xl mx-auto">
            <Card className="rounded-xl border border-[#b9b9d1] overflow-hidden">
                {specifications.map((spec, index) => (
                    <div
                        key={index}
                        className={`grid grid-cols-[220px_1fr] text-sm px-4 py-3 
                            ${index % 2 === 0 ? "bg-[#e4e4f5]" : "bg-[#f7f7fb]"} 
                            ${index !== specifications.length - 1 ? "border-b border-[#b9b9d1]" : ""}`}
                    >
                        <div className="font-medium text-[#010b62]">{spec.label}</div>
                        <div className="text-[#010b62]">{spec.value}</div>
                    </div>
                ))}
            </Card>
        </div>
    );
}
