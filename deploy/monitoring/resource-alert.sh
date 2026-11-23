#!/usr/bin/env bash
# Handoff 3.6: CPU and memory alerts to the Telegram bot. Install on BOTH servers
# (t4g.medium website + landing backend, t3.large app backend):
#   sudo cp resource-alert.sh /usr/local/bin/ && sudo chmod +x /usr/local/bin/resource-alert.sh
#   Needs TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID (same bot as the app alerts) from an env file:
#   the app's own env file on the t3.large, a small /etc/tandem-alert.env on the t4g.medium.
#   sudo crontab -e:  */5 * * * * ENV_FILE=/path/to/envfile /usr/local/bin/resource-alert.sh
# Alerts only after 2 checks in a row over the limit (10 min), then at most once an hour, plus a
# "back to normal" message.
set -u
. "${ENV_FILE:-/etc/tandem-alert.env}"

CPU_LIMIT=${CPU_LIMIT:-85}   # % busy over a 5 s sample
MEM_LIMIT=${MEM_LIMIT:-90}   # % used (MemAvailable based)
STATE=/var/tmp/resource-alert.state

read -r _ a b c idle1 rest < /proc/stat; busy1=$((a + b + c)); total1=$((a + b + c + idle1))
sleep 5
read -r _ a b c idle2 rest < /proc/stat; busy2=$((a + b + c)); total2=$((a + b + c + idle2))
cpu=$(( 100 * (busy2 - busy1) / (total2 - total1) ))
mem=$(awk '/MemTotal/{t=$2} /MemAvailable/{a=$2} END{printf "%d", 100*(t-a)/t}' /proc/meminfo)

read -r streak last_alert 2>/dev/null < "$STATE" || { streak=0; last_alert=0; }
now=$(date +%s)
send() { curl -s -m 10 "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  --data-urlencode "chat_id=${TELEGRAM_CHAT_ID}" --data-urlencode "text=$1" > /dev/null; }

if [ "$cpu" -ge "$CPU_LIMIT" ] || [ "$mem" -ge "$MEM_LIMIT" ]; then
  streak=$((streak + 1))
  if [ "$streak" -ge 2 ] && [ $((now - last_alert)) -ge 3600 ]; then
    send "🚨 $(hostname): CPU ${cpu}%, memory ${mem}% (limits ${CPU_LIMIT}% / ${MEM_LIMIT}%)"
    last_alert=$now
  fi
else
  [ "$last_alert" -gt 0 ] && send "✅ $(hostname) back to normal: CPU ${cpu}%, memory ${mem}%"
  streak=0; last_alert=0
fi
echo "$streak $last_alert" > "$STATE"
