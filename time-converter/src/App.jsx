import { useState, useEffect, useCallback } from 'react';
import {
  TIMEZONES,
  PRESETS,
  DEFAULT_TIMEZONE,
  DEFAULT_KEY,
  findByKey,
  convertTime,
  formatTime,
  formatDate,
  getTimeDifference,
  createDateInTimezone,
  getCurrentTimeInTimezone,
  isWorkingHours,
  generateShareableUrl,
  parseUrlParams,
  saveFavorites,
  loadFavorites,
  formatOffset,
} from './utils/timezone';

function App() {
  const [sourceKey, setSourceKey] = useState(DEFAULT_KEY);
  const [targetKeys, setTargetKeys] = useState(['seoul-south-korea']);
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);
  const [use24Hour, setUse24Hour] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [mode, setMode] = useState('converter'); // 'converter' or 'worldclock'
  const [copied, setCopied] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [citySearch, setCitySearch] = useState('');

  // Get timezone info from key
  const sourceInfo = findByKey(sourceKey);
  const sourceTimezone = sourceInfo?.id || DEFAULT_TIMEZONE;

  // Load from URL params or localStorage on mount
  useEffect(() => {
    const urlParams = parseUrlParams();
    if (urlParams) {
      setHour(urlParams.hour);
      setMinute(urlParams.minute);
      // Find key for source timezone
      const srcTz = TIMEZONES.find(tz => tz.id === urlParams.sourceTimezone);
      if (srcTz) setSourceKey(srcTz.key);
      // Convert target timezone IDs to keys
      const keys = urlParams.targetTimezones
        .map(id => TIMEZONES.find(tz => tz.id === id)?.key)
        .filter(Boolean);
      if (keys.length > 0) setTargetKeys(keys);
      // Clear URL params after loading
      window.history.replaceState({}, '', window.location.pathname);
    } else {
      const savedFavorites = loadFavorites();
      if (savedFavorites && savedFavorites.length > 0) {
        setTargetKeys(savedFavorites);
      }
    }

    // Set initial time to current hour
    const current = getCurrentTimeInTimezone(DEFAULT_TIMEZONE);
    setHour(current.hour);
  }, []);

  // Save favorites whenever target keys change
  useEffect(() => {
    if (targetKeys.length > 0) {
      saveFavorites(targetKeys);
    }
  }, [targetKeys]);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getConvertedTime = useCallback(
    (targetTz) => {
      const sourceDate = createDateInTimezone(hour, minute, sourceTimezone, new Date());
      return convertTime(sourceDate, sourceTimezone, targetTz);
    },
    [hour, minute, sourceTimezone]
  );

  const getLiveTime = useCallback(
    (tzId) => {
      return convertTime(currentTime, 'UTC', tzId);
    },
    [currentTime]
  );

  const handleAddTimezone = (key) => {
    if (!targetKeys.includes(key) && key !== sourceKey) {
      setTargetKeys([...targetKeys, key]);
    }
    setShowAddMenu(false);
  };

  const handleRemoveTimezone = (key) => {
    setTargetKeys(targetKeys.filter((k) => k !== key));
  };

  const handleApplyPreset = (presetName) => {
    const presetTimezones = PRESETS[presetName];
    if (presetTimezones) {
      // Convert timezone IDs to keys (use first matching city for each timezone)
      const keys = presetTimezones
        .map(id => TIMEZONES.find(tz => tz.id === id)?.key)
        .filter(key => key && key !== sourceKey);
      setTargetKeys(keys);
    }
    setShowPresets(false);
  };

  const availableTimezones = TIMEZONES.filter(
    (tz) => !targetKeys.includes(tz.key) && tz.key !== sourceKey
  ).filter((tz) => {
    if (!citySearch) return true;
    const search = citySearch.toLowerCase();
    return (
      tz.city.toLowerCase().includes(search) ||
      tz.country.toLowerCase().includes(search)
    );
  });

  const handleSetToNow = () => {
    const current = getCurrentTimeInTimezone(sourceTimezone);
    setHour(current.hour);
    setMinute(current.minute);
  };

  const getDayIndicator = (converted) => {
    const sourceDate = createDateInTimezone(hour, minute, sourceTimezone, new Date());
    const sourceConverted = convertTime(sourceDate, sourceTimezone, sourceTimezone);

    if (converted.day > sourceConverted.day || converted.month > sourceConverted.month) {
      return '+1';
    } else if (converted.day < sourceConverted.day || converted.month < sourceConverted.month) {
      return '-1';
    }
    return null;
  };

  // Get timezone IDs from keys for sharing
  const targetTimezoneIds = targetKeys.map(key => findByKey(key)?.id).filter(Boolean);

  const handleShare = async () => {
    const url = generateShareableUrl(hour, minute, sourceTimezone, targetTimezoneIds, null);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCreateMeeting = () => {
    const url = generateShareableUrl(hour, minute, sourceTimezone, targetTimezoneIds, null);
    const title = meetingTitle || 'Meeting';
    const times = targetKeys.map((key) => {
      const tzInfo = findByKey(key);
      if (!tzInfo) return null;
      const converted = getConvertedTime(tzInfo.id);
      return `${tzInfo.city}: ${formatTime(converted.hour, converted.minute, use24Hour)}`;
    }).filter(Boolean);

    const meetingText = `${title}\n\n${sourceInfo?.city}: ${formatTime(hour, minute, use24Hour)} (Host)\n${times.join('\n')}\n\nView times: ${url}`;

    navigator.clipboard.writeText(meetingText);
    setShowMeetingModal(false);
    setMeetingTitle('');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page">
      <div className="shell">
        <main className="card">
          <header className="header">
            <h1 className="title">Time Zone Converter</h1>
            <p className="subtitle">Convert times across regions instantly</p>
          </header>

          {/* Mode Toggle */}
          <div className="mode-toggle">
            <button
              className={`mode-btn ${mode === 'converter' ? 'active' : ''}`}
              onClick={() => setMode('converter')}
            >
              Converter
            </button>
            <button
              className={`mode-btn ${mode === 'worldclock' ? 'active' : ''}`}
              onClick={() => setMode('worldclock')}
            >
              World Clock
            </button>
          </div>

          {mode === 'converter' ? (
            <>
              <div className="source-section">
                <label className="label">Your time</label>
                <div className="time-input-row">
                  <div className="time-inputs">
                    <select
                      className="time-select"
                      value={hour}
                      onChange={(e) => setHour(parseInt(e.target.value, 10))}
                      aria-label="Hour"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>
                          {use24Hour ? i.toString().padStart(2, '0') : i % 12 || 12}
                        </option>
                      ))}
                    </select>
                    <span className="time-colon">:</span>
                    <select
                      className="time-select"
                      value={minute}
                      onChange={(e) => setMinute(parseInt(e.target.value, 10))}
                      aria-label="Minute"
                    >
                      {Array.from({ length: 60 }, (_, i) => (
                        <option key={i} value={i}>
                          {i.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    {!use24Hour && (
                      <span className="time-period">{hour >= 12 ? 'PM' : 'AM'}</span>
                    )}
                  </div>
                  <button className="btn-ghost btn-small" onClick={handleSetToNow}>
                    Now
                  </button>
                </div>

                <div className="timezone-select-row">
                  <select
                    className="timezone-select"
                    value={sourceKey}
                    onChange={(e) => setSourceKey(e.target.value)}
                    aria-label="Source timezone"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz.key} value={tz.key}>
                        {tz.city}, {tz.country} ({formatOffset(tz.offset)})
                      </option>
                    ))}
                  </select>
                  {sourceInfo && (
                    <span className="timezone-abbr">{sourceInfo.abbr}</span>
                  )}
                </div>
              </div>

              <div className="divider">
                <svg
                  className="divider-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </div>

              <div className="results-section">
                <div className="results-header">
                  <label className="label">Converted times</label>
                  <div className="preset-wrapper">
                    <button
                      className="btn-preset"
                      onClick={() => setShowPresets(!showPresets)}
                    >
                      Presets
                    </button>
                    {showPresets && (
                      <div className="preset-menu">
                        {Object.keys(PRESETS).map((name) => (
                          <button
                            key={name}
                            className="preset-item"
                            onClick={() => handleApplyPreset(name)}
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="timezone-cards">
                  {targetKeys.map((key) => {
                    const tzInfo = findByKey(key);
                    if (!tzInfo) return null;
                    const converted = getConvertedTime(tzInfo.id);
                    const diff = getTimeDifference(sourceTimezone, tzInfo.id);
                    const dayIndicator = getDayIndicator(converted);
                    const working = isWorkingHours(converted.hour);

                    return (
                      <div key={key} className={`timezone-card ${working ? 'working' : 'not-working'}`}>
                        <div className="tz-card-header">
                          <div className="tz-city-info">
                            <span className="tz-city">{tzInfo.city}</span>
                            <span className="tz-country">{tzInfo.country}</span>
                          </div>
                          <div className="tz-card-actions">
                            <span className={`work-indicator ${working ? 'on' : 'off'}`}>
                              {working ? 'Working' : 'Off'}
                            </span>
                            <button
                              className="btn-remove"
                              onClick={() => handleRemoveTimezone(key)}
                              aria-label={`Remove ${tzInfo.city}`}
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              >
                                <path d="M18 6L6 18M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="tz-card-time">
                          <span className="tz-time">
                            {formatTime(converted.hour, converted.minute, use24Hour)}
                          </span>
                          {dayIndicator && (
                            <span className="tz-day-indicator">{dayIndicator}</span>
                          )}
                        </div>
                        <div className="tz-card-footer">
                          <span className="tz-date">
                            {formatDate(converted.year, converted.month, converted.day)}
                          </span>
                          <span className="tz-diff">
                            {diff >= 0 ? '+' : ''}
                            {diff}h
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  <div className="add-timezone-wrapper">
                    <button
                      className="btn-add-timezone"
                      onClick={() => {
                        setShowAddMenu(!showAddMenu);
                        setCitySearch('');
                      }}
                      aria-label="Add timezone"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      <span>Add City</span>
                    </button>

                    {showAddMenu && (
                      <div className="add-menu">
                        <input
                          type="text"
                          className="add-menu-search"
                          placeholder="Search cities..."
                          value={citySearch}
                          onChange={(e) => setCitySearch(e.target.value)}
                          autoFocus
                        />
                        <div className="add-menu-list">
                          {availableTimezones.length === 0 ? (
                            <div className="add-menu-empty">
                              {citySearch ? 'No cities found' : 'All cities added'}
                            </div>
                          ) : (
                            availableTimezones.slice(0, 50).map((tz) => (
                              <button
                                key={tz.key}
                                className="add-menu-item"
                                onClick={() => {
                                  handleAddTimezone(tz.key);
                                  setCitySearch('');
                                }}
                              >
                                <span className="add-menu-city">{tz.city}</span>
                                <span className="add-menu-country">{tz.country}</span>
                                <span className="add-menu-offset">{formatOffset(tz.offset)}</span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button className="btn-action" onClick={handleShare}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98M21 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM21 19a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  {copied ? 'Copied!' : 'Share Link'}
                </button>
                <button className="btn-action btn-primary" onClick={() => setShowMeetingModal(true)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Schedule Meeting
                </button>
              </div>
            </>
          ) : (
            /* World Clock Mode */
            <div className="world-clock-section">
              <div className="timezone-cards">
                {/* Source timezone in world clock */}
                <div className="timezone-card world-clock-card source-card">
                  <div className="tz-city-info">
                    <span className="tz-city">{sourceInfo?.city}</span>
                    <span className="tz-country">{sourceInfo?.country} (You)</span>
                  </div>
                  <div className="tz-card-time">
                    <span className="tz-time tz-time-live">
                      {formatTime(getLiveTime(sourceTimezone).hour, getLiveTime(sourceTimezone).minute, use24Hour)}
                      <span className="tz-seconds">:{getLiveTime(sourceTimezone).second.toString().padStart(2, '0')}</span>
                    </span>
                  </div>
                  <div className="tz-card-footer">
                    <span className="tz-date">
                      {formatDate(getLiveTime(sourceTimezone).year, getLiveTime(sourceTimezone).month, getLiveTime(sourceTimezone).day)}
                    </span>
                  </div>
                </div>

                {targetKeys.map((key) => {
                  const tzInfo = findByKey(key);
                  if (!tzInfo) return null;
                  const live = getLiveTime(tzInfo.id);
                  const diff = getTimeDifference(sourceTimezone, tzInfo.id);
                  const working = isWorkingHours(live.hour);

                  return (
                    <div key={key} className={`timezone-card world-clock-card ${working ? 'working' : 'not-working'}`}>
                      <div className="tz-card-header">
                        <div className="tz-city-info">
                          <span className="tz-city">{tzInfo.city}</span>
                          <span className="tz-country">{tzInfo.country}</span>
                        </div>
                        <span className={`work-indicator ${working ? 'on' : 'off'}`}>
                          {working ? 'Working' : 'Off'}
                        </span>
                      </div>
                      <div className="tz-card-time">
                        <span className="tz-time tz-time-live">
                          {formatTime(live.hour, live.minute, use24Hour)}
                          <span className="tz-seconds">:{live.second.toString().padStart(2, '0')}</span>
                        </span>
                      </div>
                      <div className="tz-card-footer">
                        <span className="tz-date">
                          {formatDate(live.year, live.month, live.day)}
                        </span>
                        <span className="tz-diff">
                          {diff >= 0 ? '+' : ''}
                          {diff}h
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="settings-row">
            <label className="toggle-label">
              <span>24-hour format</span>
              <button
                className={`toggle ${use24Hour ? 'active' : ''}`}
                onClick={() => setUse24Hour(!use24Hour)}
                role="switch"
                aria-checked={use24Hour}
              >
                <span className="toggle-knob" />
              </button>
            </label>
          </div>
        </main>

        <footer className="credit">
          <a
            href="https://instagram.com/berkindev"
            target="_blank"
            rel="noopener noreferrer"
          >
            Coded by @berkindev
          </a>
        </footer>
      </div>

      {/* Meeting Modal */}
      {showMeetingModal && (
        <div className="modal-overlay" onClick={() => setShowMeetingModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Schedule Meeting</h2>
            <p className="modal-subtitle">Create a shareable meeting invite</p>

            <div className="modal-field">
              <label className="label">Meeting Title</label>
              <input
                type="text"
                className="modal-input"
                placeholder="Team Sync, Project Review..."
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                autoFocus
              />
            </div>

            <div className="modal-preview">
              <div className="preview-time">
                <span className="preview-city">{sourceInfo?.city}</span>
                <span className="preview-value">{formatTime(hour, minute, use24Hour)} (Host)</span>
              </div>
              {targetKeys.map((key) => {
                const tzInfo = findByKey(key);
                if (!tzInfo) return null;
                const converted = getConvertedTime(tzInfo.id);
                return (
                  <div key={key} className="preview-time">
                    <span className="preview-city">{tzInfo.city}</span>
                    <span className="preview-value">{formatTime(converted.hour, converted.minute, use24Hour)}</span>
                  </div>
                );
              })}
            </div>

            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setShowMeetingModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleCreateMeeting}>
                Copy Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
