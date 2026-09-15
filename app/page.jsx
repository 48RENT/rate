<select
  value={pickupTimeOption}
  onChange={(e) =>
    setPickupTimeOption(e.target.value)
  }
  style={{
    width: "100%",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  }}
>
  <option value="normal">
    เวลาปกติ 10.00–18.00 น. — ไม่มีค่านอกเวลา
  </option>

  <optgroup label="รอบเช้า">
    <option value="before6">
      6.00 น. - 6.59 น.
    </option>

    <option value="before7">
      7.00 น. - 7.59 น.
    </option>

    <option value="before8">
      8.00 น. - 8.59 น.
    </option>

    <option value="before9">
      9.00 น. - 9.59 น.
    </option>
  </optgroup>

  <optgroup label="รอบเย็น">
    <option value="after19">
      19.00 น. - 19.59 น.
    </option>

    <option value="after20">
      20.00 น. - 20.59 น.
    </option>

    <option value="after21">
      21.00 น. - 21.59 น.
    </option>

    <option value="after22">
      22.00 น. - 22.59 น.
    </option>
  </optgroup>
</select>
