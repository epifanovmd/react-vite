import { describe, expect, it } from "vitest";

import { enrollmentTokenState } from "../useEnrollAgentVM";
import {
  enrollmentTokenSchema,
  INSTALL_DEFAULTS,
  installCommandSchema,
  parsePairs,
  splitList,
  tokenExpiresAt,
} from "../validation";

describe("enroll-agent validation", () => {
  it("пары ключ=значение: запятые и строки, ключ без значения", () => {
    expect(parsePairs("zone=eu, gpu\nrack = 4")).toEqual({
      pairs: { zone: "eu", gpu: "", rack: "4" },
    });
    expect(parsePairs("bad pair")).toEqual({ error: "bad pair" });
  });

  it("список через запятые и пробелы", () => {
    expect(splitList(" curl, jq\nwget ")).toEqual(["curl", "jq", "wget"]);
  });

  it("срок токена: бессрочный — без даты", () => {
    expect(tokenExpiresAt("never")).toBeUndefined();
    expect(tokenExpiresAt("1h", 0)).toBe(new Date(3_600_000).toISOString());
  });

  it("метки токена превращаются в объект, пустые — нет", () => {
    const parsed = enrollmentTokenSchema.parse({
      name: "eu",
      expiry: "1d",
      singleUse: true,
      labels: "zone=eu",
    });

    expect(parsed.labels).toEqual({ zone: "eu" });
    expect(
      enrollmentTokenSchema.parse({ ...parsed, labels: "" }).labels,
    ).toBeUndefined();
    expect(
      enrollmentTokenSchema.safeParse({ ...parsed, labels: "a b" }).success,
    ).toBe(false);
  });

  it("команда установки: ровно одно из токена и файла с токеном", () => {
    expect(installCommandSchema.safeParse(INSTALL_DEFAULTS).success).toBe(
      false,
    );
    expect(
      installCommandSchema.safeParse({
        ...INSTALL_DEFAULTS,
        token: "p.s",
        tokenFile: "/etc/token",
      }).success,
    ).toBe(false);

    const parsed = installCommandSchema.parse({
      ...INSTALL_DEFAULTS,
      token: "p.s",
      packages: "curl jq",
      sysctl: "net.ipv4.ip_forward=1",
    });

    expect(parsed).toMatchObject({
      token: "p.s",
      tokenFile: undefined,
      name: undefined,
      packages: ["curl", "jq"],
      rwPaths: undefined,
      sysctl: { "net.ipv4.ip_forward": "1" },
    });
  });

  it("неверный адрес сервера и время остановки", () => {
    const result = installCommandSchema.safeParse({
      ...INSTALL_DEFAULTS,
      token: "p.s",
      baseUrl: "not a url",
      stopTimeout: "30 seconds",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map(i => i.path[0]).sort()).toEqual([
      "baseUrl",
      "stopTimeout",
    ]);
  });

  it("состояние токена", () => {
    const token = {
      revokedAt: null,
      expiresAt: null,
      maxUses: 1,
      uses: 0,
    } as Parameters<typeof enrollmentTokenState>[0];

    expect(enrollmentTokenState(token)).toBe("active");
    expect(enrollmentTokenState({ ...token, uses: 1 })).toBe("used");
    expect(
      enrollmentTokenState({ ...token, expiresAt: "2000-01-01T00:00:00Z" }),
    ).toBe("expired");
    expect(
      enrollmentTokenState({ ...token, revokedAt: "2000-01-01T00:00:00Z" }),
    ).toBe("revoked");
  });
});
