<script lang="ts">
    // TODO: Make Title and logo loadable from config
</script>

<div class="chat-titlebar">
<h5>Chat UI</h5>
<div class="chat-avatar">
    <img src="https://cdn.dribbble.com/users/37530/screenshots/2937858/drib_blink_bot.gif" alt="">
</div>
</div>

<style lang="scss">
.chat-titlebar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  contain: layout;
  background: var(--chat-ui_theme, blue);
  color: var(--chat-ui_theme_text-color, white);
  box-shadow: 0 0.1rem 1rem hsla(0, 0%, 0%, .4);
  overflow: hidden;
  padding: .5em 1em;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 11;
  will-change: transform;
  transition: transform 0.15s var(--chat-ui_easing-quick);
  
  & > h5 {
    font-size: 1em;
    font-weight: normal;
    line-height: 1.1;
    flex: 2;
    margin: 0;
  }
}

.chat-avatar {
  width: 2em;
  height: 2em;
  border-radius: 50%;
  margin: 0;
  overflow: hidden;
  display: inline-block;
  
  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>