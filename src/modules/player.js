import {
  $isPressing,
  $timeRatio,
  player,
  transform,
  playerTrajectory,
  $dash,
  isAbleToDash,
  isReleaseVelocityEnough,
  dash,
  isPlayerInvincibleAfterDamage,
  $health,
  $stageIndex,
  $g,
  $stageWave,
  draw,
  cameraFrameSize,
  $reflectionY,
  reflect,
  effects,
  isReflected
} from '../state';
import { PLAYER_POS_CHANGE, PRESS_UP, emit, listen } from '../events';
import {
  vectorOp,
  vector,
  getObjectBoundary,
  getActionProgress,
  objectEvent,
  vectorMagnitude
} from '../utils';
import {
  KEY_OBJECT_ON_UPDATE,
  KEY_OBJECT_FRAME,
  KEY_PLAYER_DEATH_FRAME,
  PLAYER_DEATH_ANIMATION_DURATION,
  KEY_OBJECT_EVENT_GET_OFFSET
} from '../constants';
import { setStage } from '../helper/stage';
import { ripple, checkRipple } from '../helper/graphic';

listen(PRESS_UP, () => {
  dash();
});

let isPlayerUnderWater = false;

function drawPlayer(player) {
  draw(26, ctx => {
    // visualize velocity
    ctx.strokeStyle = '#f0f';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(...transform(player.p));
    ctx.lineTo(
      ...transform(vectorOp((pos, v) => pos + v * 5, [player.p, player.v]))
    );
    ctx.stroke();
  
    if ($isPressing.$ && isAbleToDash()) {
      ctx.strokeStyle = `rgba(0,255,0,${isReleaseVelocityEnough() ? 1 : 0})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(...transform(player.p));
      playerTrajectory().forEach((pos) => {
        ctx.lineTo(...transform(vector(pos.x, pos.y)));
        // ctx.strokeRect(...transform(vector(pos.x - player.s.x / 2, pos.y + player.s.y / 2)), transform(player.s.x), transform(player.s.y));
      });
      ctx.stroke();
    }
  })
  
  draw(25, ctx => {
    // draw character
    if (isPlayerInvincibleAfterDamage()) {
      ctx.fillStyle =
        Math.round(player[KEY_OBJECT_FRAME]) % 8 > 3
          ? 'rgba(255,255,255, 0.1)'
          : '#fff';
    } else if ($dash.$ === 0) {
      ctx.fillStyle = '#444';
    } else {
      ctx.fillStyle = '#fff';
    }
    const { l, t, b } = getObjectBoundary(player);
    let height = transform(player.s.y);
    if (player[KEY_PLAYER_DEATH_FRAME]) {
      const deathProgress = Math.min(
        1,
        getActionProgress(
          player[KEY_OBJECT_FRAME] - player[KEY_PLAYER_DEATH_FRAME],
          PLAYER_DEATH_ANIMATION_DURATION,
          false
        )
      );
      height *= 1 - 0.7 * deathProgress;
    }
    ctx.fillRect(...transform(vector(l, t)), transform(player.s.x), height);
    
    if(isReflected(player)) {
      ctx.globalAlpha = 0.3;
      ctx.fillRect(...reflect(vector(l, t)), transform(player.s.x), -height);
      ctx.globalAlpha = 1;
    }
  })
}

function update(player) {
  if (!player[KEY_PLAYER_DEATH_FRAME] && $health.$ === 0) {
    player[KEY_PLAYER_DEATH_FRAME] = player[KEY_OBJECT_FRAME];
  }

  // gravity pulling
  player.v.y -= $g.$ * $timeRatio.$;

  // update position
  vectorOp((pos, v) => pos + v * $timeRatio.$, [player.p, player.v], player.p);
  emit(PLAYER_POS_CHANGE, player.p);
}

const death = objectEvent(
  () => {
    setStage($stageIndex.$, $stageWave.$)
  },
  PLAYER_DEATH_ANIMATION_DURATION,
  {
    [KEY_OBJECT_EVENT_GET_OFFSET]: (stage) => stage[KEY_PLAYER_DEATH_FRAME],
  }
);

player[KEY_OBJECT_ON_UPDATE] = [death, update, drawPlayer, checkRipple()];
