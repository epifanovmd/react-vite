import {
  bankAccountMask,
  bicMask,
  Card,
  CardContent,
  CardDescription,
  cardExpiryMask,
  CardHeader,
  cardNumberMask,
  CardTitle,
  createCurrencyMask,
  createPatternMask,
  createPercentMask,
  type DateRange,
  hexColorMask,
  innMask,
  ipAddressMask,
  licensePlateMask,
  macAddressMask,
  MaskedDatePicker,
  MaskedDateRangePicker,
  MaskedInput,
  ogrnMask,
  passportMask,
  phoneMask,
  postalCodeMask,
  snilsMask,
  timeMask,
} from "@shared/ui";
import {
  Clock,
  CreditCard,
  Hash,
  MapPin,
  Network,
  Palette,
  Percent,
  Phone,
  Wallet,
} from "lucide-react";
import { type FC, type ReactNode, useState } from "react";

const Row = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
    {children}
  </div>
);

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <p className="text-[10px] text-muted-foreground">{label}</p>
    {children}
  </div>
);

const GroupTitle = ({ children }: { children: ReactNode }) => (
  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
    {children}
  </p>
);

const currencyMask = createCurrencyMask({ scale: 0, thousandsSeparator: " " });
const discountMask = createPercentMask({ max: 100 });
const productCodeMask = createPatternMask("AA-0000", {
  definitions: { A: /[A-Za-zА-Яа-я]/ },
});

export const MaskedInputsSection: FC = () => {
  const [phone, setPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [time, setTime] = useState("");
  const [amount, setAmount] = useState("");
  const [discount, setDiscount] = useState("");
  const [productCode, setProductCode] = useState("");
  const [maskedDate, setMaskedDate] = useState<Date | undefined>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const [snils, setSnils] = useState("");
  const [passport, setPassport] = useState("");
  const [inn, setInn] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bic, setBic] = useState("");
  const [ogrn, setOgrn] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [licensePlate, setLicensePlate] = useState("");

  const [ip, setIp] = useState("");
  const [mac, setMac] = useState("");
  const [hexColor, setHexColor] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Маскированный ввод</CardTitle>
        <CardDescription className="text-xs">
          react-imask: MaskedInput и useMaskedInput/useDateMaskInput — любое
          поле по маске
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div>
          <GroupTitle>Общие пресеты</GroupTitle>
          <Row>
            <Field label="Телефон (phoneMask)">
              <MaskedInput
                mask={phoneMask}
                value={phone}
                onChange={info => setPhone(info.value)}
                leftIcon={<Phone className="h-4 w-4" />}
                placeholder="+7 (___) ___-__-__"
              />
            </Field>
            <Field label="Номер карты (cardNumberMask)">
              <MaskedInput
                mask={cardNumberMask}
                value={cardNumber}
                onChange={info => setCardNumber(info.value)}
                leftIcon={<CreditCard className="h-4 w-4" />}
                placeholder="0000 0000 0000 0000"
              />
            </Field>
            <Field label="Срок карты (cardExpiryMask)">
              <MaskedInput
                mask={cardExpiryMask}
                value={cardExpiry}
                onChange={info => setCardExpiry(info.value)}
                placeholder="MM/YY"
              />
            </Field>
            <Field label="Время (timeMask)">
              <MaskedInput
                mask={timeMask}
                value={time}
                onChange={info => setTime(info.value)}
                leftIcon={<Clock className="h-4 w-4" />}
                placeholder="ЧЧ:ММ"
              />
            </Field>
            <Field label="Сумма (createCurrencyMask)">
              <MaskedInput
                mask={currencyMask}
                value={amount}
                onChange={info => setAmount(info.value)}
                leftIcon={<Wallet className="h-4 w-4" />}
                placeholder="0"
                clearable
              />
            </Field>
            <Field label="Скидка (createPercentMask)">
              <MaskedInput
                mask={discountMask}
                value={discount}
                onChange={info => setDiscount(info.value)}
                leftIcon={<Percent className="h-4 w-4" />}
                placeholder="0%"
              />
            </Field>
            <Field label="Код товара (createPatternMask)">
              <MaskedInput
                mask={productCodeMask}
                value={productCode}
                onChange={info => setProductCode(info.value)}
                leftIcon={<Hash className="h-4 w-4" />}
                placeholder="AA-0000"
              />
            </Field>
          </Row>
        </div>

        <hr className="border-border" />

        <div>
          <GroupTitle>Документы РФ</GroupTitle>
          <Row>
            <Field label="СНИЛС (snilsMask)">
              <MaskedInput
                mask={snilsMask}
                value={snils}
                onChange={info => setSnils(info.value)}
                placeholder="000-000-000 00"
              />
            </Field>
            <Field label="Паспорт (passportMask)">
              <MaskedInput
                mask={passportMask}
                value={passport}
                onChange={info => setPassport(info.value)}
                placeholder="0000 000000"
              />
            </Field>
            <Field label="ИНН (innMask)">
              <MaskedInput
                mask={innMask}
                value={inn}
                onChange={info => setInn(info.value)}
                placeholder="000000000000"
              />
            </Field>
            <Field label="Расчётный счёт (bankAccountMask)">
              <MaskedInput
                mask={bankAccountMask}
                value={bankAccount}
                onChange={info => setBankAccount(info.value)}
                placeholder="0000 0000 0000 0000 0000"
              />
            </Field>
            <Field label="БИК (bicMask)">
              <MaskedInput
                mask={bicMask}
                value={bic}
                onChange={info => setBic(info.value)}
                placeholder="000000000"
              />
            </Field>
            <Field label="ОГРН (ogrnMask)">
              <MaskedInput
                mask={ogrnMask}
                value={ogrn}
                onChange={info => setOgrn(info.value)}
                placeholder="0000000000000"
              />
            </Field>
            <Field label="Индекс (postalCodeMask)">
              <MaskedInput
                mask={postalCodeMask}
                value={postalCode}
                onChange={info => setPostalCode(info.value)}
                leftIcon={<MapPin className="h-4 w-4" />}
                placeholder="000000"
              />
            </Field>
            <Field label="Госномер авто (licensePlateMask)">
              <MaskedInput
                mask={licensePlateMask}
                value={licensePlate}
                onChange={info => setLicensePlate(info.value)}
                placeholder="А000АА 000"
              />
            </Field>
          </Row>
        </div>

        <hr className="border-border" />

        <div>
          <GroupTitle>Технические</GroupTitle>
          <Row>
            <Field label="IP-адрес (ipAddressMask)">
              <MaskedInput
                mask={ipAddressMask}
                value={ip}
                onChange={info => setIp(info.value)}
                leftIcon={<Network className="h-4 w-4" />}
                placeholder="000.000.000.000"
              />
            </Field>
            <Field label="MAC-адрес (macAddressMask)">
              <MaskedInput
                mask={macAddressMask}
                value={mac}
                onChange={info => setMac(info.value)}
                placeholder="00:1A:2B:3C:4D:5E"
              />
            </Field>
            <Field label="HEX-цвет (hexColorMask)">
              <MaskedInput
                mask={hexColorMask}
                value={hexColor}
                onChange={info => setHexColor(info.value)}
                leftIcon={<Palette className="h-4 w-4" />}
                placeholder="#FFFFFF"
              />
            </Field>
          </Row>
        </div>

        <hr className="border-border" />

        <div>
          <GroupTitle>Дата и период с маской ввода</GroupTitle>
          <Row>
            <Field label="MaskedDatePicker — печатайте, выбирайте в календаре или наводите для превью">
              <MaskedDatePicker
                value={maskedDate}
                onChange={setMaskedDate}
                clearable
                openOnFocus
              />
            </Field>
            <Field label="MaskedDateRangePicker — период одной маской «от — до»">
              <MaskedDateRangePicker
                value={dateRange}
                onChange={setDateRange}
                clearable
                openOnFocus
              />
            </Field>
          </Row>
        </div>
      </CardContent>
    </Card>
  );
};
