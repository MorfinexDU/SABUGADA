import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [characterName, setCharacterName] = useState('');
  const [characterIcon, setCharacterIcon] = useState('🧙');
  const [showCharacterCreation, setShowCharacterCreation] = useState(true);
  const [showLoadScreen, setShowLoadScreen] = useState(false);
  const [currentSaveSlot, setCurrentSaveSlot] = useState(null);
  
  const getIconStats = (icon) => {
    const stats = {
      '🧙': { strength: 8, agility: 8, intelligence: 14, vitality: 12 },
      '🧙‍♀️': { strength: 8, agility: 8, intelligence: 16, vitality: 10 },
      '🧙‍♂️': { strength: 8, agility: 8, intelligence: 15, vitality: 11 },
      '🧝': { strength: 10, agility: 14, intelligence: 8, vitality: 10 },
      '🧝‍♀️': { strength: 10, agility: 12, intelligence: 8, vitality: 12 },
      '🧝‍♂️': { strength: 10, agility: 13, intelligence: 8, vitality: 11 },
      '🦸': { strength: 14, agility: 10, intelligence: 8, vitality: 10 },
      '🦸‍♀️': { strength: 16, agility: 10, intelligence: 8, vitality: 8 },
      '🦸‍♂️': { strength: 15, agility: 10, intelligence: 8, vitality: 9 },
      '🦹': { strength: 10, agility: 8, intelligence: 10, vitality: 14 },
      '🦹‍♀️': { strength: 10, agility: 9, intelligence: 10, vitality: 13 },
      '🦹‍♂️': { strength: 11, agility: 9, intelligence: 11, vitality: 11 }
    };
    return stats[icon] || { strength: 10, agility: 10, intelligence: 10, vitality: 10 };
  };
  
  const [player, setPlayer] = useState({
    level: 1,
    xp: 0,
    xpToNext: 100,
    hp: 100,
    maxHp: 100,
    strength: 10,
    agility: 10,
    intelligence: 10,
    vitality: 10,
    kills: 0,
    bossCounter: 0,
    unlockedDungeons: 1,
    dungeonBossLevel: 1,
    sabugos: 0,
    xpBoost: 1,
    xpBoostRounds: 0
  });

  const [enemy, setEnemy] = useState(null);
  const [combat, setCombat] = useState(false);
  const [log, setLog] = useState([]);
  const [attackTimer, setAttackTimer] = useState(0);
  const [levelUpPoints, setLevelUpPoints] = useState(0);
  const [currentDungeon, setCurrentDungeon] = useState(1);
  const [showDungeonSelect, setShowDungeonSelect] = useState(false);
  const [equipment, setEquipment] = useState({ 
    weapon: null, 
    helmet: null, 
    chest: null, 
    legs: null, 
    boots: null, 
    accessory: null 
  });
  const [inventory, setInventory] = useState([]);
  const [showInventory, setShowInventory] = useState(false);
  const [lootedItem, setLootedItem] = useState(null);
  const [mana, setMana] = useState(100);
  const [maxMana, setMaxMana] = useState(100);
  const [equippedSpells, setEquippedSpells] = useState(['fireball', 'slow', 'stun', 'shock']);
  const [showSpellbook, setShowSpellbook] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [allSpells] = useState([
    { id: 'fireball', name: 'Bola de Fogo', cost: 20, damage: 30, type: 'damage', icon: '🔥', unlockLevel: 1 },
    { id: 'slow', name: 'Lentidão', cost: 15, duration: 5000, type: 'slow', icon: '❄️', unlockLevel: 1 },
    { id: 'stun', name: 'Paralisia', cost: 30, duration: 3000, type: 'stun', icon: '⚡', unlockLevel: 1 },
    { id: 'shock', name: 'Eletrificar', cost: 25, duration: 8000, type: 'shock', icon: '⚡', unlockLevel: 1 },
    { id: 'meteor', name: 'Meteoro', cost: 40, damage: 80, type: 'damage', icon: '☄️', unlockLevel: 10 },
    { id: 'heal', name: 'Cura', cost: 30, heal: 50, type: 'heal', icon: '❤️', unlockLevel: 10 },
    { id: 'freeze', name: 'Congelar', cost: 35, duration: 5000, dps: 8, type: 'freeze', icon: '❄️', unlockLevel: 20 },
    { id: 'poison', name: 'Veneno', cost: 20, duration: 10000, dps: 5, type: 'poison', icon: '🧪', unlockLevel: 20 },
    { id: 'lightning', name: 'Relâmpago', cost: 50, damage: 120, type: 'damage', icon: '⚡', unlockLevel: 30 },
    { id: 'shield', name: 'Escudo', cost: 40, duration: 10000, type: 'shield', icon: '🛡️', unlockLevel: 30 },
    { id: 'drain', name: 'Drenar Vida', cost: 35, damage: 40, heal: 40, type: 'drain', icon: '🧛', unlockLevel: 40 },
    { id: 'haste', name: 'Acelerar', cost: 25, duration: 8000, type: 'haste', icon: '💨', unlockLevel: 40 },
    { id: 'inferno', name: 'Inferno', cost: 60, damage: 150, type: 'damage', icon: '🔥', unlockLevel: 50 },
    { id: 'reflect', name: 'Refletir', cost: 45, duration: 12000, type: 'reflect', icon: '🔮', unlockLevel: 50 },
    { id: 'timewarp', name: 'Distorcer Tempo', cost: 50, duration: 6000, type: 'timewarp', icon: '⏳', unlockLevel: 60 },
    { id: 'nova', name: 'Nova Arcana', cost: 70, damage: 200, type: 'damage', icon: '✨', unlockLevel: 60 },
    { id: 'invulnerable', name: 'Invulnerável', cost: 80, duration: 5000, type: 'invulnerable', icon: '👼', unlockLevel: 70 },
    { id: 'apocalypse', name: 'Apocalipse', cost: 100, damage: 300, type: 'damage', icon: '🔪', unlockLevel: 70 }
  ]);
  const [enemyEffects, setEnemyEffects] = useState({ slow: false, stun: false, shock: false, poison: false });
  const [playerEffects, setPlayerEffects] = useState({ shield: false, haste: false, reflect: false, invulnerable: false });
  const [screenEffect, setScreenEffect] = useState(null);
  const [floatingText, setFloatingText] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextAttackKey, setNextAttackKey] = useState('ArrowLeft');
  const [showDeathPopup, setShowDeathPopup] = useState(false);
  const [deathXpLoss, setDeathXpLoss] = useState(0);
  const enemyTimerRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const playerRef = useRef(player);
  const enemyRef = useRef(enemy);
  const manaRegenRef = useRef(null);

  useEffect(() => {
    const saves = [];
    for (let i = 1; i <= 3; i++) {
      if (localStorage.getItem(`rpgSave${i}`)) saves.push(i);
    }
    if (saves.length > 0 && !showLoadScreen) {
      setShowLoadScreen(true);
      setShowCharacterCreation(false);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  useEffect(() => {
    enemyRef.current = enemy;
  }, [enemy]);

  useEffect(() => {
    manaRegenRef.current = setInterval(() => {
      setMana(prev => Math.min(prev + 2 + Math.floor(player.vitality / 5), maxMana));
    }, 1000);
    return () => clearInterval(manaRegenRef.current);
  }, [maxMana, player.vitality]);

  useEffect(() => {
    const hpRegenInterval = setInterval(() => {
      setPlayer(prev => {
        const bonus = getTotalStats();
        const baseRegen = Math.floor(prev.vitality / 3);
        const legendaryRegen = bonus.regeneration > 0 ? Math.floor(prev.maxHp * (bonus.regeneration / 100)) : 0;
        const totalRegen = baseRegen + legendaryRegen;
        
        if (prev.hp < prev.maxHp + bonus.maxHp && !combat) {
          return { ...prev, hp: Math.min(prev.hp + totalRegen, prev.maxHp + bonus.maxHp) };
        }
        return prev;
      });
    }, 2000);
    return () => clearInterval(hpRegenInterval);
  }, [combat, player.vitality]);

  const generateItem = (enemyLevel) => {
    const types = ['weapon', 'helmet', 'chest', 'legs', 'boots', 'accessory'];
    const type = types[Math.floor(Math.random() * types.length)];
    const rarity = Math.random();
    
    let rarityName, multiplier, numStats;
    if (rarity < 0.50) { rarityName = 'Comum'; multiplier = 1; numStats = 1; }
    else if (rarity < 0.75) { rarityName = 'Mágico'; multiplier = 1.3; numStats = 2; }
    else if (rarity < 0.90) { rarityName = 'Raro'; multiplier = 1.7; numStats = 3; }
    else if (rarity < 0.97) { rarityName = 'Épico'; multiplier = 2.2; numStats = 4; }
    else { rarityName = 'Lendário'; multiplier = 3; numStats = 5; }
    
    const baseStats = Math.floor(enemyLevel * multiplier);
    
    const typeNames = {
      weapon: 'Arma',
      helmet: 'Capacete',
      chest: 'Peitoral',
      legs: 'Perneira',
      boots: 'Botas',
      accessory: 'Acessório'
    };
    
    const item = {
      id: Date.now() + Math.random(),
      type,
      name: `${rarityName} ${typeNames[type]}`,
      rarity: rarityName,
      strength: 0,
      agility: 0,
      intelligence: 0,
      hp: 0
    };

    const availableStats = [];
    if (type === 'weapon') availableStats.push('strength', 'agility', 'intelligence');
    else if (type === 'helmet' || type === 'chest' || type === 'legs') availableStats.push('hp', 'strength', 'intelligence');
    else if (type === 'boots') availableStats.push('agility', 'hp', 'strength');
    else if (type === 'accessory') availableStats.push('agility', 'intelligence', 'strength');

    const selectedStats = availableStats.slice(0, Math.min(numStats, availableStats.length));
    
    selectedStats.forEach(stat => {
      if (stat === 'hp') item.hp = baseStats * 10;
      else item[stat] = baseStats + Math.floor(Math.random() * 5);
    });

    if (rarityName === 'Lendário') {
      const effectTypes = [
        { name: 'vampirismo', min: 5, max: 30 },
        { name: 'regeneração', min: 10, max: 50 },
        { name: 'espinhos', min: 15, max: 40 },
        { name: 'velocidade', min: 5, max: 25 },
        { name: 'crítico', min: 5, max: 20 },
        { name: 'resistência', min: 10, max: 30 }
      ];
      const selectedEffect = effectTypes[Math.floor(Math.random() * effectTypes.length)];
      item.effect = selectedEffect.name;
      item.effectValue = selectedEffect.min + Math.floor(Math.random() * (selectedEffect.max - selectedEffect.min + 1));
    }

    return item;
  };

  const getTotalStats = () => {
    let bonus = { strength: 0, agility: 0, intelligence: 0, maxHp: 0, vampirism: 0, regeneration: 0, thorns: 0, speed: 0, crit: 0, resistance: 0 };
    Object.values(equipment).forEach(item => {
      if (item) {
        bonus.strength += item.strength;
        bonus.agility += item.agility;
        bonus.intelligence += item.intelligence;
        bonus.maxHp += item.hp;
        if (item.effect && item.effectValue) {
          if (item.effect === 'vampirismo') bonus.vampirism += item.effectValue;
          if (item.effect === 'regeneração') bonus.regeneration += item.effectValue;
          if (item.effect === 'espinhos') bonus.thorns += item.effectValue;
          if (item.effect === 'velocidade') bonus.speed += item.effectValue;
          if (item.effect === 'crítico') bonus.crit += item.effectValue;
          if (item.effect === 'resistência') bonus.resistance += item.effectValue;
        }
      }
    });
    return bonus;
  };

  const equipItem = (item) => {
    const current = equipment[item.type];
    if (current) {
      setInventory(prev => [...prev, current]);
    }
    setEquipment(prev => ({ ...prev, [item.type]: item }));
    setInventory(prev => prev.filter(i => i.id !== item.id));
    addLog(`${item.name} equipado!`);
  };

  const unequipItem = (type) => {
    const item = equipment[type];
    if (item) {
      setInventory(prev => [...prev, item]);
      setEquipment(prev => ({ ...prev, [type]: null }));
      addLog(`${item.name} desequipado!`);
    }
  };

  const discardItem = (itemId) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;
    
    const rarityValues = {
      'Comum': 1,
      'Mágico': 3,
      'Raro': 8,
      'Épico': 20,
      'Lendário': 50
    };
    
    const sabugosGained = rarityValues[item.rarity] || 1;
    setPlayer(prev => ({ ...prev, sabugos: prev.sabugos + sabugosGained }));
    setInventory(prev => prev.filter(i => i.id !== itemId));
    addLog(`Item descartado! +${sabugosGained} 🌽`);
  };

  const getEquippedSpells = () => {
    return equippedSpells.map((id, index) => {
      const spell = allSpells.find(s => s.id === id);
      return spell ? { ...spell, key: ['Q', 'W', 'E', 'R'][index] } : null;
    }).filter(Boolean);
  };

  const equipSpell = (spellId, slot) => {
    const newEquipped = [...equippedSpells];
    const existingIndex = newEquipped.indexOf(spellId);
    
    if (existingIndex !== -1 && existingIndex !== slot) {
      newEquipped[existingIndex] = null;
    }
    
    newEquipped[slot] = spellId;
    setEquippedSpells(newEquipped);
  };

  const castSpell = (spell) => {
    if (!enemy || enemy.hp <= 0 || mana < spell.cost) return;
    
    setMana(prev => prev - spell.cost);
    
    if (spell.type === 'damage') {
      const dmg = spell.damage + Math.floor(player.intelligence * 2);
      setEnemy(prev => ({ ...prev, hp: Math.max(0, prev.hp - dmg) }));
      addLog(`${spell.icon} ${spell.name}! ${dmg} de dano!`);
      showFloatingText(`${spell.icon} ${dmg}`, 'spell');
      triggerScreenEffect('fire');
      if (enemy.hp - dmg <= 0) {
        setTimeout(() => defeatEnemy(), 300);
      }
    } else if (spell.type === 'heal') {
      const healAmount = spell.heal + Math.floor(player.intelligence);
      setPlayer(prev => ({ ...prev, hp: Math.min(prev.hp + healAmount, prev.maxHp + getTotalStats().maxHp) }));
      addLog(`${spell.icon} Curado ${healAmount} HP!`);
      triggerScreenEffect('heal');
    } else if (spell.type === 'drain') {
      const dmg = spell.damage + Math.floor(player.intelligence * 2);
      setEnemy(prev => ({ ...prev, hp: Math.max(0, prev.hp - dmg) }));
      setPlayer(prev => ({ ...prev, hp: Math.min(prev.hp + spell.heal, prev.maxHp + getTotalStats().maxHp) }));
      addLog(`${spell.icon} ${dmg} dano e +${spell.heal} HP!`);
      showFloatingText(`${spell.icon} ${dmg}`, 'drain');
      triggerScreenEffect('drain');
    } else if (spell.type === 'slow') {
      setEnemyEffects(prev => ({ ...prev, slow: true }));
      addLog(`${spell.icon} ${spell.name} aplicado!`);
      showFloatingText(`${spell.icon}`, 'effect');
      triggerScreenEffect('ice');
      setTimeout(() => setEnemyEffects(prev => ({ ...prev, slow: false })), spell.duration);
    } else if (spell.type === 'stun') {
      setEnemyEffects(prev => ({ ...prev, stun: true }));
      addLog(`${spell.icon} Inimigo paralisado!`);
      showFloatingText(`${spell.icon}`, 'effect');
      triggerScreenEffect('lightning');
      setTimeout(() => setEnemyEffects(prev => ({ ...prev, stun: false })), spell.duration);
    } else if (spell.type === 'freeze') {
      setEnemyEffects(prev => ({ ...prev, stun: true }));
      addLog(`${spell.icon} Inimigo congelado!`);
      showFloatingText(`${spell.icon}`, 'effect');
      triggerScreenEffect('ice');
      const freezeInterval = setInterval(() => {
        setEnemy(prev => prev ? ({ ...prev, hp: Math.max(0, prev.hp - spell.dps) }) : null);
      }, 1000);
      setTimeout(() => {
        clearInterval(freezeInterval);
        setEnemyEffects(prev => ({ ...prev, stun: false }));
      }, spell.duration);
    } else if (spell.type === 'shock') {
      setEnemyEffects(prev => ({ ...prev, shock: true }));
      addLog(`${spell.icon} Inimigo eletrificado! +50% dano`);
      showFloatingText(`${spell.icon}`, 'effect');
      triggerScreenEffect('shock');
      setTimeout(() => setEnemyEffects(prev => ({ ...prev, shock: false })), spell.duration);
    } else if (spell.type === 'poison') {
      setEnemyEffects(prev => ({ ...prev, poison: true }));
      addLog(`${spell.icon} Veneno aplicado!`);
      showFloatingText(`${spell.icon}`, 'effect');
      triggerScreenEffect('poison');
      const poisonInterval = setInterval(() => {
        setEnemy(prev => prev ? ({ ...prev, hp: Math.max(0, prev.hp - spell.dps) }) : null);
      }, 1000);
      setTimeout(() => {
        clearInterval(poisonInterval);
        setEnemyEffects(prev => ({ ...prev, poison: false }));
      }, spell.duration);
    } else if (spell.type === 'shield') {
      setPlayerEffects(prev => ({ ...prev, shield: true }));
      addLog(`${spell.icon} Escudo ativado!`);
      triggerScreenEffect('shield');
      setTimeout(() => setPlayerEffects(prev => ({ ...prev, shield: false })), spell.duration);
    } else if (spell.type === 'haste') {
      setPlayerEffects(prev => ({ ...prev, haste: true }));
      addLog(`${spell.icon} Velocidade aumentada!`);
      triggerScreenEffect('haste');
      setTimeout(() => setPlayerEffects(prev => ({ ...prev, haste: false })), spell.duration);
    } else if (spell.type === 'reflect') {
      setPlayerEffects(prev => ({ ...prev, reflect: true }));
      addLog(`${spell.icon} Reflexão ativada!`);
      triggerScreenEffect('reflect');
      setTimeout(() => setPlayerEffects(prev => ({ ...prev, reflect: false })), spell.duration);
    } else if (spell.type === 'invulnerable') {
      setPlayerEffects(prev => ({ ...prev, invulnerable: true }));
      addLog(`${spell.icon} Invulnerabilidade!`);
      triggerScreenEffect('invulnerable');
      setTimeout(() => setPlayerEffects(prev => ({ ...prev, invulnerable: false })), spell.duration);
    } else if (spell.type === 'timewarp') {
      setEnemyEffects(prev => ({ ...prev, slow: true, stun: true }));
      addLog(`${spell.icon} Tempo distorcido!`);
      triggerScreenEffect('timewarp');
      setTimeout(() => setEnemyEffects(prev => ({ ...prev, slow: false, stun: false })), spell.duration);
    }
  };

  const triggerScreenEffect = (type) => {
    setScreenEffect(type);
    setTimeout(() => setScreenEffect(null), 500);
  };

  const showFloatingText = (text, type) => {
    setFloatingText({ text, type });
    setTimeout(() => setFloatingText(null), 1000);
  };

  const dungeons = [
    { id: 1, name: 'Masmorra Iniciante', minLevel: 1, maxLevel: 5, icon: '🏛️' },
    { id: 2, name: 'Caverna Sombria', minLevel: 6, maxLevel: 10, icon: '⛰️' },
    { id: 3, name: 'Floresta Maldita', minLevel: 11, maxLevel: 20, icon: '🌲' },
    { id: 4, name: 'Castelo Assombrado', minLevel: 21, maxLevel: 30, icon: '🏰' },
    { id: 5, name: 'Vulcão Infernal', minLevel: 31, maxLevel: 40, icon: '🌋' },
    { id: 6, name: 'Torre Arcana', minLevel: 41, maxLevel: 50, icon: '🗼' },
    { id: 7, name: 'Abismo Profundo', minLevel: 51, maxLevel: 60, icon: '🕳️' },
    { id: 8, name: 'Cripta Eterna', minLevel: 61, maxLevel: 70, icon: '⚰️' },
    { id: 9, name: 'Dimensão do Caos', minLevel: 71, maxLevel: 100, icon: '🌀' }
  ];

  const getInfiniteDungeon = (dungeonId) => {
    if (dungeonId <= 9) return null;
    const tier = dungeonId - 9;
    const baseLevel = 100 + (tier - 1) * 25;
    return {
      id: dungeonId,
      name: `Dimensão do Infinito ${tier}`,
      minLevel: baseLevel + 1,
      maxLevel: baseLevel + 25,
      icon: '♾️'
    };
  };

  const getCurrentDungeonInfo = () => {
    const baseDungeon = dungeons.find(d => d.id === currentDungeon);
    return baseDungeon || getInfiniteDungeon(currentDungeon);
  };

  const generateEnemy = () => {
    const dungeon = getCurrentDungeonInfo();
    const isBoss = (player.bossCounter + 1) % 10 === 0;
    const bossLevel = player.dungeonBossLevel;
    const isFinalBoss = bossLevel >= dungeon.maxLevel;
    
    let difficulty;
    if (isBoss) {
      difficulty = Math.min(dungeon.minLevel + bossLevel - 1, dungeon.maxLevel);
    } else {
      const maxNormalLevel = Math.min(dungeon.minLevel + bossLevel, dungeon.maxLevel);
      const range = maxNormalLevel - dungeon.minLevel;
      difficulty = dungeon.minLevel + Math.floor(Math.random() * (range + 1));
    }
    
    const speed = 800 + Math.random() * 1500;
    const isFast = speed < 1400;
    
    if (isBoss) {
      return {
        name: isFinalBoss ? `👑 BOSS FINAL Nv.${difficulty}` : `👑 BOSS ${bossLevel} Nv.${difficulty}`,
        level: difficulty,
        hp: (240 + difficulty * 100) * 3,
        maxHp: (240 + difficulty * 100) * 3,
        strength: (12 + difficulty * 6) * 1.5,
        agility: (8 + difficulty * 3) * 1.5,
        intelligence: (8 + difficulty * 3) * 1.5,
        attackSpeed: speed * 0.8,
        xpReward: (15 + difficulty * 8) * 3,
        isFast,
        isBoss: true,
        isFinalBoss
      };
    }
    
    return {
      name: `Inimigo Nv.${difficulty}`,
      level: difficulty,
      hp: 240 + difficulty * 100,
      maxHp: 240 + difficulty * 100,
      strength: 12 + difficulty * 6,
      agility: 8 + difficulty * 3,
      intelligence: 8 + difficulty * 3,
      attackSpeed: speed,
      xpReward: 15 + difficulty * 8,
      isFast,
      isBoss: false,
      isFinalBoss: false
    };
  };

  const addLog = (msg) => {
    setLog(prev => [msg, ...prev.slice(0, 4)]);
  };

  const calculateDamage = (attacker, defender) => {
    const bonus = attacker === playerRef.current ? getTotalStats() : { strength: 0, agility: 0 };
    const baseDmg = attacker.strength + bonus.strength;
    const critChance = (attacker.agility + bonus.agility) / 200;
    const isCrit = Math.random() < critChance;
    
    let dmg = Math.floor(baseDmg * (isCrit ? 2 : 1) * (0.8 + Math.random() * 0.4));
    
    if (attacker === playerRef.current) {
      dmg = Math.floor(dmg * 0.6);
      if (enemyEffects.shock) {
        dmg = Math.floor(dmg * 1.5);
      }
    }
    
    return { dmg, isCrit };
  };

  const playerAttack = () => {
    if (!enemyRef.current || enemyRef.current.hp <= 0) return;

    const { dmg, isCrit } = calculateDamage(playerRef.current, enemyRef.current);
    const bonus = getTotalStats();
    
    let finalDmg = dmg;
    if (bonus.crit > 0 && isCrit) {
      finalDmg = Math.floor(dmg * (1 + bonus.crit / 100));
    }
    
    const newHp = Math.max(0, enemyRef.current.hp - finalDmg);
    
    if (bonus.vampirism > 0) {
      const heal = Math.floor(finalDmg * (bonus.vampirism / 100));
      setPlayer(prev => ({ ...prev, hp: Math.min(prev.hp + heal, prev.maxHp + bonus.maxHp) }));
      if (heal > 0) addLog(`🧙 Vampirismo: +${heal} HP`);
    }
    
    setEnemy(prev => ({ ...prev, hp: newHp }));
    addLog(`Você ataca! ${finalDmg} de dano${isCrit ? ' CRÍTICO!' : ''}`);
    
    if (isCrit) {
      showFloatingText(`⚔️ ${finalDmg} CRIT!`, 'crit');
      triggerScreenEffect('crit');
    } else {
      showFloatingText(`⚔️ ${finalDmg}`, 'attack');
      triggerScreenEffect('attack');
    }

    setNextAttackKey(nextAttackKey === 'ArrowLeft' ? 'ArrowRight' : 'ArrowLeft');

    if (newHp <= 0) {
      setTimeout(() => defeatEnemy(), 300);
    }
  };

  const enemyAttack = () => {
    const currentEnemy = enemyRef.current;
    const currentPlayer = playerRef.current;
    
    if (!currentEnemy || currentEnemy.hp <= 0 || enemyEffects.stun) return;
    if (playerEffects.invulnerable) {
      addLog('👼 Ataque bloqueado por invulnerabilidade!');
      return;
    }

    const { dmg, isCrit } = calculateDamage(currentEnemy, currentPlayer);
    const bonus = getTotalStats();
    let finalDmg = dmg;
    
    if (bonus.resistance > 0) {
      finalDmg = Math.floor(dmg * (1 - bonus.resistance / 100));
    }
    
    if (playerEffects.shield) {
      finalDmg = Math.floor(finalDmg * 0.5);
      addLog(`🛡️ Escudo absorveu ${Math.floor(dmg - finalDmg)} de dano!`);
    }
    
    if (playerEffects.reflect) {
      setEnemy(prev => ({ ...prev, hp: Math.max(0, prev.hp - Math.floor(dmg * 0.3)) }));
      addLog(`🔮 Refletiu ${Math.floor(dmg * 0.3)} de dano!`);
    }
    
    if (bonus.thorns > 0) {
      const thornsDmg = Math.floor(dmg * (bonus.thorns / 100));
      setEnemy(prev => ({ ...prev, hp: Math.max(0, prev.hp - thornsDmg) }));
      addLog(`🌵 Espinhos: ${thornsDmg} de dano refletido!`);
    }
    
    const newHp = Math.max(0, currentPlayer.hp - finalDmg);
    
    setPlayer(prev => ({ ...prev, hp: newHp }));
    addLog(`${currentEnemy.name} ataca! ${finalDmg} de dano${isCrit ? ' CRÍTICO!' : ''}`);

    if (newHp <= 0) {
      setTimeout(gameOver, 0);
    }
  };

  const defeatEnemy = () => {
    const xpGained = enemy.xpReward * (player.xpBoost || 1);
    const sabugosGained = enemy.isBoss ? enemy.level * 3 : enemy.level;
    const newXp = player.xp + xpGained;
    const newKills = player.kills + 1;
    const newBossCounter = player.bossCounter + 1;
    const newSabugos = player.sabugos + sabugosGained;
    const newXpBoostRounds = Math.max(0, (player.xpBoostRounds || 0) - 1);
    const newXpBoost = newXpBoostRounds > 0 ? player.xpBoost : 1;
    
    let newUnlockedDungeons = player.unlockedDungeons;
    let newDungeonBossLevel = player.dungeonBossLevel;
    
    if (enemy.isBoss) {
      if (enemy.isFinalBoss) {
        const nextDungeon = currentDungeon + 1;
        if (nextDungeon > player.unlockedDungeons) {
          newUnlockedDungeons = nextDungeon;
          if (nextDungeon <= 9) {
            addLog(`🎉 Nova masmorra desbloqueada: ${dungeons[nextDungeon - 1].name}!`);
          } else {
            addLog(`🎉 Nova dimensão desbloqueada: Dimensão do Infinito ${nextDungeon - 9}!`);
          }
        }
        newDungeonBossLevel = 1;
      } else {
        newDungeonBossLevel++;
      }
    }
    
    const baseDropChance = enemy.isBoss ? 0.8 : 0.08 + (enemy.level * 0.005);
    const dropChance = Math.random();
    
    if (dropChance < baseDropChance) {
      const item = generateItem(enemy.level);
      setInventory(prev => [...prev, item]);
      setLootedItem(item);
      addLog(`${enemy.name} derrotado! +${xpGained} XP | +${sabugosGained} 🌽 | ${item.name} obtido!`);
    } else {
      addLog(`${enemy.name} derrotado! +${xpGained} XP | +${sabugosGained} 🌽`);
    }
    
    if (newXp >= player.xpToNext) {
      levelUp(newXp, newKills, newBossCounter, newUnlockedDungeons, newDungeonBossLevel, newSabugos, newXpBoost, newXpBoostRounds);
    } else {
      setPlayer(prev => ({ ...prev, xp: newXp, kills: newKills, bossCounter: newBossCounter, unlockedDungeons: newUnlockedDungeons, dungeonBossLevel: newDungeonBossLevel, sabugos: newSabugos, xpBoost: newXpBoost, xpBoostRounds: newXpBoostRounds }));
    }
    
    setCombat(false);
    setEnemy(null);
    clearInterval(enemyTimerRef.current);
  };

  const levelUp = (currentXp, kills, bossCounter, unlockedDungeons, dungeonBossLevel, sabugos, xpBoost, xpBoostRounds) => {
    const newLevel = player.level + 1;
    const overflow = currentXp - player.xpToNext;
    const bonus = getTotalStats();
    
    setPlayer(prev => ({
      ...prev,
      level: newLevel,
      xp: overflow,
      xpToNext: Math.floor(prev.xpToNext * 1.8),
      maxHp: prev.maxHp + 15 + bonus.maxHp,
      hp: prev.maxHp + 15 + bonus.maxHp,
      kills,
      bossCounter,
      unlockedDungeons,
      dungeonBossLevel,
      sabugos,
      xpBoost,
      xpBoostRounds
    }));
    
    setLevelUpPoints(3);
    setCombat(false);
    setEnemy(null);
    clearInterval(enemyTimerRef.current);
    clearInterval(timerIntervalRef.current);
    addLog(`LEVEL UP! Nível ${newLevel}! Distribua 3 pontos`);
  };

  const addStat = (stat) => {
    if (levelUpPoints <= 0) return;
    
    setPlayer(prev => ({
      ...prev,
      [stat]: prev[stat] + 1
    }));
    
    setLevelUpPoints(prev => prev - 1);
  };

  const gameOver = () => {
    setCombat(false);
    clearInterval(enemyTimerRef.current);
    
    const xpLost = Math.floor(player.xp * 0.5);
    setDeathXpLoss(xpLost);
    setShowDeathPopup(true);
    triggerScreenEffect('death');
    
    setTimeout(() => {
      const newXp = Math.max(0, player.xp - xpLost);
      const bonus = getTotalStats();
      
      setPlayer(prev => ({
        ...prev,
        hp: prev.maxHp + bonus.maxHp,
        xp: newXp
      }));
      
      setShowDeathPopup(false);
      addLog(`💀 VOCÊ MORREU! Perdeu ${xpLost} XP`);
      setEnemy(null);
      setLog([]);
    }, 2000);
  };

  const getPlayerColor = () => {
    const level = player.level;
    if (level < 5) return { bg: 'linear-gradient(135deg, #4CAF50, #45a049)', border: '#4CAF50' };
    if (level < 10) return { bg: 'linear-gradient(135deg, #2196F3, #1976D2)', border: '#2196F3' };
    if (level < 20) return { bg: 'linear-gradient(135deg, #9C27B0, #7B1FA2)', border: '#9C27B0' };
    if (level < 30) return { bg: 'linear-gradient(135deg, #FF9800, #F57C00)', border: '#FF9800' };
    if (level < 50) return { bg: 'linear-gradient(135deg, #F44336, #D32F2F)', border: '#F44336' };
    return { bg: 'linear-gradient(135deg, #FFD700, #FFA500)', border: '#FFD700' };
  };

  const startCombat = () => {
    const newEnemy = generateEnemy();
    setEnemy(newEnemy);
    setCombat(true);
    setEnemyEffects({ slow: false, stun: false, shock: false, poison: false });
    if (newEnemy.isBoss) {
      if (newEnemy.isFinalBoss) {
        addLog(`👑 BOSS FINAL APARECEU! ${newEnemy.name} ${newEnemy.isFast ? '⚡ RÁPIDO' : '🐢 LENTO'}`);
      } else {
        addLog(`👑 BOSS APARECEU! ${newEnemy.name} ${newEnemy.isFast ? '⚡ RÁPIDO' : '🐢 LENTO'}`);
      }
    } else {
      addLog(`${newEnemy.name} apareceu! ${newEnemy.isFast ? '⚡ RÁPIDO' : '🐢 LENTO'}`);
    }
  };

  const escapeBoss = () => {
    const randomOffset = Math.floor(Math.random() * 3);
    setPlayer(prev => ({ ...prev, bossCounter: randomOffset }));
    setLog([]);
    addLog('🏃 Você escapou do boss!');
  };

  const saveGame = () => {
    if (!currentSaveSlot) return;
    const saveData = { player, characterName, characterIcon, equipment, inventory, equippedSpells, mana, currentDungeon };
    localStorage.setItem(`rpgSave${currentSaveSlot}`, JSON.stringify(saveData));
    addLog('💾 Jogo salvo!');
  };

  const resetGame = () => {
    if (window.confirm('Voltar ao menu inicial?')) {
      setGameStarted(false);
      setShowLoadScreen(true);
      setShowCharacterCreation(false);
    }
  };

  const startNewGame = () => {
    if (!characterName.trim()) return window.alert('Digite um nome!');
    let slot = null;
    for (let i = 1; i <= 3; i++) {
      if (!localStorage.getItem(`rpgSave${i}`)) {
        slot = i;
        break;
      }
    }
    if (!slot) return window.alert('Todos os slots estão ocupados! Delete um save primeiro.');
    
    const iconStats = getIconStats(characterIcon);
    setPlayer(prev => ({
      ...prev,
      strength: iconStats.strength,
      agility: iconStats.agility,
      intelligence: iconStats.intelligence,
      vitality: iconStats.vitality
    }));
    
    setCurrentSaveSlot(slot);
    setGameStarted(true);
    setShowCharacterCreation(false);
  };

  const loadGame = (slot) => {
    const saved = localStorage.getItem(`rpgSave${slot}`);
    if (!saved) return window.alert('Nenhum jogo salvo encontrado!');
    try {
      const data = JSON.parse(saved);
      const loadedPlayer = data.player.dungeonBossLevel ? data.player : { ...data.player, dungeonBossLevel: 1 };
      setPlayer({ ...loadedPlayer, sabugos: loadedPlayer.sabugos || 0 });
      setCharacterName(data.characterName);
      setCharacterIcon(data.characterIcon);
      setEquipment(data.equipment);
      setInventory(data.inventory);
      setEquippedSpells(data.equippedSpells);
      setMana(data.mana);
      setCurrentDungeon(data.currentDungeon || 1);
      setCurrentSaveSlot(slot);
      setGameStarted(true);
      setShowCharacterCreation(false);
      setShowLoadScreen(false);
    } catch (e) {
      window.alert('Erro ao carregar jogo!');
    }
  };

  const deleteSave = (slot) => {
    if (window.confirm('Deletar este personagem?')) {
      localStorage.removeItem(`rpgSave${slot}`);
      const saves = [];
      for (let i = 1; i <= 3; i++) {
        if (localStorage.getItem(`rpgSave${i}`)) saves.push(i);
      }
      if (saves.length === 0) {
        setShowLoadScreen(false);
        setShowCharacterCreation(true);
      } else {
        window.location.reload();
      }
    }
  };

  const startNewGameFromLoad = () => {
    setPlayer({
      level: 1,
      xp: 0,
      xpToNext: 100,
      hp: 100,
      maxHp: 100,
      strength: 10,
      agility: 10,
      intelligence: 10,
      vitality: 10,
      kills: 0,
      bossCounter: 0,
      unlockedDungeons: 1,
      dungeonBossLevel: 1,
      sabugos: 0
    });
    setEnemy(null);
    setCombat(false);
    setLog([]);
    setEquipment({ weapon: null, helmet: null, chest: null, legs: null, boots: null, accessory: null });
    setInventory([]);
    setEquippedSpells(['fireball', 'slow', 'stun', 'shock']);
    setMana(100);
    setCurrentDungeon(1);
    setCharacterName('');
    setCharacterIcon('🧙');
    setCurrentSaveSlot(null);
    setShowLoadScreen(false);
    setShowCharacterCreation(true);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === nextAttackKey) {
        if (levelUpPoints === 0 && combat && enemy?.hp > 0) {
          playerAttack();
        }
      }
      if (e.key === 'b' || e.key === 'B') {
        if (!combat && levelUpPoints === 0) {
          startCombat();
        }
      }
      if (e.key === 'i' || e.key === 'I') {
        setShowInventory(prev => !prev);
      }
      if (e.key === 'm' || e.key === 'M') {
        setShowSpellbook(prev => !prev);
      }
      if (e.key === 's' || e.key === 'S') {
        if (!combat) saveGame();
      }
      if (combat && enemy?.hp > 0) {
        const spell = getEquippedSpells().find(s => s.key.toLowerCase() === e.key.toLowerCase());
        if (spell) castSpell(spell);
      }
      if (levelUpPoints > 0) {
        if (e.key === '1') addStat('strength');
        if (e.key === '2') addStat('agility');
        if (e.key === '3') addStat('intelligence');
        if (e.key === '4') addStat('vitality');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [combat, levelUpPoints, enemy, mana, equippedSpells, nextAttackKey]);

  useEffect(() => {
    if (combat && enemy) {
      const bonus = getTotalStats();
      const speedBonus = bonus.speed > 0 ? (1 - bonus.speed / 100) : 1;
      const currentSpeed = (enemyEffects.slow ? enemy.attackSpeed * 2 : enemy.attackSpeed) * speedBonus;
      setAttackTimer(currentSpeed);
      
      clearInterval(enemyTimerRef.current);
      clearInterval(timerIntervalRef.current);
      
      enemyTimerRef.current = setInterval(() => {
        enemyAttack();
        const speed = (enemyEffects.slow ? enemy.attackSpeed * 2 : enemy.attackSpeed) * speedBonus;
        setAttackTimer(speed);
      }, currentSpeed);
      
      timerIntervalRef.current = setInterval(() => {
        setAttackTimer(prev => Math.max(0, prev - 100));
      }, 100);
    }

    return () => {
      clearInterval(enemyTimerRef.current);
      clearInterval(timerIntervalRef.current);
    };
  }, [combat, enemy?.name, enemyEffects.slow]);

  if (showLoadScreen) {
    const saves = [];
    for (let i = 1; i <= 3; i++) {
      const saved = localStorage.getItem(`rpgSave${i}`);
      if (saved) {
        try {
          saves.push({ slot: i, data: JSON.parse(saved) });
        } catch (e) {}
      }
    }

    return (
      <div className="character-creation">
        <div className="creation-modal">
          <h1>⚔️ Selecionar Personagem</h1>
          <div style={{ marginBottom: '20px' }}>
            {saves.map(({ slot, data }) => (
              <div key={slot} style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '10px', marginBottom: '15px', border: '2px solid transparent', transition: 'all 0.2s', position: 'relative' }}>
                <button onClick={() => deleteSave(slot)} style={{ position: 'absolute', top: '10px', right: '10px', background: '#f44336', border: 'none', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9em' }}>🗑️</button>
                <div onClick={() => loadGame(slot)} style={{ cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.parentElement.style.borderColor = '#667eea'} onMouseLeave={(e) => e.currentTarget.parentElement.style.borderColor = 'transparent'}>
                  <div style={{ fontSize: '3em', textAlign: 'center', marginBottom: '10px' }}>{data.characterIcon}</div>
                  <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Slot {slot}: {data.characterName}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.9em' }}>
                    <span>🎯 Nível: {data.player.level}</span>
                    <span>❤️ HP: {data.player.hp}/{data.player.maxHp}</span>
                    <span>💪 Força: {data.player.strength}</span>
                    <span>⚡ Agilidade: {data.player.agility}</span>
                    <span>🧠 Inteligência: {data.player.intelligence}</span>
                    <span>❤️ Vitalidade: {data.player.vitality}</span>
                    <span>💀 Abates: {data.player.kills}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={startNewGameFromLoad} className="btn-primary" style={{ width: '100%' }}>Novo Jogo</button>
        </div>
      </div>
    );
  }

  if (showCharacterCreation) {
    const icons = ['🧙', '🧙‍♀️', '🧙‍♂️', '🧝', '🧝‍♀️', '🧝‍♂️', '🦸', '🦸‍♀️', '🦸‍♂️', '🦹', '🦹‍♀️', '🦹‍♂️'];
    const iconStats = getIconStats(characterIcon);
    return (
      <div className="character-creation">
        <div className="creation-modal">
          <h1>⚔️ Criar Personagem</h1>
          <div className="creation-section">
            <label>Nome:</label>
            <input type="text" value={characterName} onChange={(e) => setCharacterName(e.target.value)} placeholder="Digite o nome..." maxLength={20} autoFocus />
          </div>
          <div className="creation-section">
            <label>Escolha seu Ícone:</label>
            <div className="icon-selector">
              {icons.map(icon => (
                <div key={icon} className={`icon-option ${characterIcon === icon ? 'selected' : ''}`} onClick={() => setCharacterIcon(icon)}>{icon}</div>
              ))}
            </div>
          </div>
          <div className="creation-section">
            <label>Stats Iniciais:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9em', marginTop: '10px' }}>
              <span>💪 Força: {iconStats.strength}</span>
              <span>⚡ Agilidade: {iconStats.agility}</span>
              <span>🧠 Inteligência: {iconStats.intelligence}</span>
              <span>❤️ Vitalidade: {iconStats.vitality}</span>
            </div>
          </div>
          <button onClick={startNewGame} className="btn-primary" style={{ width: '100%' }}>Começar Aventura</button>
        </div>
      </div>
    );
  }

  if (!gameStarted) return null;

  const formatTime = () => {
    return currentTime.toLocaleString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className={`game ${screenEffect ? `effect-${screenEffect}` : ''}`}>
      {showDeathPopup && (
        <div className="death-popup">
          <h1>FALECEU</h1>
          <p>- {deathXpLoss} XP</p>
        </div>
      )}
      
      <div className="news-ticker">
        <div className="news-ticker-content">
          <span>⚔️ Sabugada v1.0 - {formatTime()}</span>
          <span>⚔️ Sabugada v1.0 - {formatTime()}</span>
          <span>⚔️ Sabugada v1.0 - {formatTime()}</span>
        </div>
      </div>

      <div className="dungeon-sidebar">
        <button 
          onClick={() => setShowShop(true)}
          style={{ 
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            border: '3px solid #FFD700',
            borderRadius: '10px',
            color: '#000',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
            textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.4)';
          }}
        >
          <span style={{ fontSize: '2em' }}>🛍️</span>
          <span style={{ fontSize: '0.9em' }}>Loja do Tio Bento</span>
        </button>
        <h3 style={{ marginBottom: '10px', fontSize: '1em' }}>🏛️ Masmorras</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
          {[...dungeons, ...Array.from({ length: Math.max(0, player.unlockedDungeons - 9) }, (_, i) => getInfiniteDungeon(10 + i))].map(dungeon => (
            <button 
              key={dungeon.id}
              onClick={() => setCurrentDungeon(dungeon.id)}
              disabled={dungeon.id > player.unlockedDungeons}
              style={{ 
                padding: '10px', 
                background: currentDungeon === dungeon.id ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255,255,255,0.1)',
                border: currentDungeon === dungeon.id ? '2px solid #667eea' : '2px solid transparent',
                borderRadius: '8px',
                color: 'white',
                cursor: dungeon.id > player.unlockedDungeons ? 'not-allowed' : 'pointer',
                opacity: dungeon.id > player.unlockedDungeons ? 0.3 : 1,
                fontSize: '0.85em',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <div>{dungeon.icon} {dungeon.name}</div>
              <small style={{ opacity: 0.8 }}>Nv.{dungeon.minLevel}-{dungeon.maxLevel}</small>
            </button>
          ))}
        </div>
      </div>
      {levelUpPoints > 0 && (
        <div className="level-up">
          <h2>🎉 Level Up! Distribua {levelUpPoints} pontos</h2>
          <div className="stat-buttons">
            <button onClick={() => addStat('strength')} className="btn-stat">💪 +1 Força [1]</button>
            <button onClick={() => addStat('agility')} className="btn-stat">⚡ +1 Agilidade [2]</button>
            <button onClick={() => addStat('intelligence')} className="btn-stat">🧠 +1 Inteligência [3]</button>
            <button onClick={() => addStat('vitality')} className="btn-stat">❤️ +1 Vitalidade [4]</button>
          </div>
        </div>
      )}

      {showSpellbook && (
        <div className="modal-overlay" onClick={() => setShowSpellbook(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>📚 Grimoire de Magias</h2>
            <button className="close-btn" onClick={() => setShowSpellbook(false)}>×</button>
            
            <div className="spellbook-slots">
              <h3>Magias Equipadas</h3>
              <div className="equipped-spells">
                {equippedSpells.map((spellId, index) => {
                  const spell = allSpells.find(s => s.id === spellId);
                  return (
                    <div key={index} className="spell-slot">
                      <strong>[{['Q', 'W', 'E', 'R'][index]}]</strong>
                      {spell && <span>{spell.icon} {spell.name}</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="spellbook-list">
              <h3>Magias Disponíveis</h3>
              {allSpells.filter(s => s.unlockLevel <= player.level).map(spell => (
                <div key={spell.id} className="spellbook-item">
                  <div className="spell-info">
                    <strong>{spell.icon} {spell.name}</strong>
                    <small>Custo: {spell.cost} mana | Nível {spell.unlockLevel}</small>
                  </div>
                  <div className="spell-equip-btns">
                    {[0, 1, 2, 3].map(slot => (
                      <button 
                        key={slot}
                        className="btn-equip-spell"
                        onClick={() => equipSpell(spell.id, slot)}
                      >
                        [{['Q', 'W', 'E', 'R'][slot]}]
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="spell-progression">
              <h3>Progresso de Magias</h3>
              <div className="spell-milestones">
                {[1, 10, 20, 30, 40, 50, 60, 70].map(level => {
                  const spellsAtLevel = allSpells.filter(s => s.unlockLevel === level);
                  const isUnlocked = player.level >= level;
                  return (
                    <div key={level} className={`milestone ${isUnlocked ? 'unlocked' : 'locked'}`}>
                      <div className="milestone-level">Nv.{level}</div>
                      <div className="milestone-spells">
                        {spellsAtLevel.map(spell => (
                          <span key={spell.id} className="milestone-icon" title={spell.name}>
                            {spell.icon}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {lootedItem && (
        <div className="modal-overlay" onClick={() => setLootedItem(null)}>
          <div className="loot-modal" onClick={(e) => e.stopPropagation()}>
            <h2>🎉 Item Obtido!</h2>
            <div className={`loot-item ${lootedItem.rarity.toLowerCase()}`}>
              <h3>{lootedItem.name}</h3>
              <div className="loot-stats">
                {lootedItem.strength > 0 && <span>💪 Força: +{lootedItem.strength}</span>}
                {lootedItem.agility > 0 && <span>⚡ Agilidade: +{lootedItem.agility}</span>}
                {lootedItem.intelligence > 0 && <span>🧠 Inteligência: +{lootedItem.intelligence}</span>}
                {lootedItem.hp > 0 && <span>❤️ HP: +{lootedItem.hp}</span>}
                {lootedItem.effect && <span style={{ color: '#FFD700', fontWeight: 'bold' }}>✨ {lootedItem.effect.charAt(0).toUpperCase() + lootedItem.effect.slice(1)}: {lootedItem.effectValue}%</span>}
              </div>
            </div>
            <button className="btn-primary" onClick={() => setLootedItem(null)}>Continuar</button>
          </div>
        </div>
      )}

      {showInventory && (
        <div className="modal-overlay" onClick={() => setShowInventory(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Equipamento e Inventário</h2>
            <button className="close-btn" onClick={() => setShowInventory(false)}>×</button>
            
            <div className="equipment">
              <h3>Equipamento</h3>
              <div className="equipment-paper-doll">
                <div className="equipment-row">
                  <div className="equipment-slot" onClick={() => unequipItem('helmet')}>
                    {equipment.helmet ? (
                      <div className={`item ${equipment.helmet.rarity.toLowerCase()}`}>
                        <strong>🧢 {equipment.helmet.name}</strong>
                        <small>HP+{equipment.helmet.hp} 💪+{equipment.helmet.strength}</small>
                      </div>
                    ) : <div className="empty-slot">🧢 Capacete</div>}
                  </div>
                </div>
                
                <div className="equipment-row">
                  <div className="equipment-slot" onClick={() => unequipItem('weapon')}>
                    {equipment.weapon ? (
                      <div className={`item ${equipment.weapon.rarity.toLowerCase()}`}>
                        <strong>⚔️ {equipment.weapon.name}</strong>
                        <small>💪+{equipment.weapon.strength} ⚡+{equipment.weapon.agility}</small>
                      </div>
                    ) : <div className="empty-slot">⚔️ Arma</div>}
                  </div>
                  
                  <div className="equipment-slot" onClick={() => unequipItem('chest')}>
                    {equipment.chest ? (
                      <div className={`item ${equipment.chest.rarity.toLowerCase()}`}>
                        <strong>🛡️ {equipment.chest.name}</strong>
                        <small>HP+{equipment.chest.hp} 💪+{equipment.chest.strength}</small>
                      </div>
                    ) : <div className="empty-slot">🛡️ Peitoral</div>}
                  </div>
                  
                  <div className="equipment-slot" onClick={() => unequipItem('accessory')}>
                    {equipment.accessory ? (
                      <div className={`item ${equipment.accessory.rarity.toLowerCase()}`}>
                        <strong>💍 {equipment.accessory.name}</strong>
                        <small>⚡+{equipment.accessory.agility} 💪+{equipment.accessory.strength}</small>
                      </div>
                    ) : <div className="empty-slot">💍 Acessório</div>}
                  </div>
                </div>
                
                <div className="equipment-row">
                  <div className="equipment-slot" onClick={() => unequipItem('legs')}>
                    {equipment.legs ? (
                      <div className={`item ${equipment.legs.rarity.toLowerCase()}`}>
                        <strong>🧤 {equipment.legs.name}</strong>
                        <small>HP+{equipment.legs.hp} 💪+{equipment.legs.strength}</small>
                      </div>
                    ) : <div className="empty-slot">🧤 Perneira</div>}
                  </div>
                </div>
                
                <div className="equipment-row">
                  <div className="equipment-slot" onClick={() => unequipItem('boots')}>
                    {equipment.boots ? (
                      <div className={`item ${equipment.boots.rarity.toLowerCase()}`}>
                        <strong>🥾 {equipment.boots.name}</strong>
                        <small>⚡+{equipment.boots.agility} 💪+{equipment.boots.strength}</small>
                      </div>
                    ) : <div className="empty-slot">🥾 Botas</div>}
                  </div>
                </div>
              </div>
            </div>

            <div className="inventory">
              <h3>Inventário ({inventory.length})</h3>
              {inventory.length > 0 ? (
                <div className="inventory-items">
                  {inventory.map(item => {
                    const rarityValues = { 'Comum': 1, 'Mágico': 3, 'Raro': 8, 'Épico': 20, 'Lendário': 50 };
                    const discardValue = rarityValues[item.rarity] || 1;
                    return (
                    <div key={item.id} className={`item ${item.rarity.toLowerCase()}`}>
                      <div style={{ flex: 1 }}>
                        <strong>{item.name}</strong>
                        <small style={{ display: 'block' }}>
                          {item.strength > 0 && `💪+${item.strength} `}
                          {item.agility > 0 && `⚡+${item.agility} `}
                          {item.intelligence > 0 && `🧠+${item.intelligence} `}
                          {item.hp > 0 && `❤️+${item.hp} `}
                          {item.effect && <span style={{ color: '#FFD700' }}>✨{item.effect}: {item.effectValue}%</span>}
                        </small>
                      </div>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button onClick={() => equipItem(item)} style={{ background: '#667eea', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9em' }}>✅</button>
                        <button onClick={() => discardItem(item.id)} style={{ background: '#f44336', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9em' }} title={`Descartar por ${discardValue} 🌽`}>🗑️ {discardValue}🌽</button>
                      </div>
                    </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ opacity: 0.5, textAlign: 'center', padding: '20px' }}>Nenhum item no inventário</p>
              )}
            </div>
          </div>
        </div>
      )}

      {showShop && (
        <div className="modal-overlay" onClick={() => setShowShop(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', padding: 0, overflow: 'hidden' }}>
            <button 
              className="close-btn" 
              onClick={() => setShowShop(false)} 
              style={{ 
                position: 'absolute', 
                top: '15px', 
                right: '15px', 
                zIndex: 10,
                background: 'linear-gradient(135deg, #f44336, #d32f2f)',
                border: '2px solid #fff',
                color: 'white',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                fontSize: '1.5em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #d32f2f, #b71c1c)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
              }}
            >
              ×
            </button>
            
            <div style={{ display: 'flex', minHeight: '500px' }}>
              {/* Lado Esquerdo - Tio Bento */}
              <div style={{ 
                width: '35%',
                background: 'linear-gradient(135deg, #8B4513, #654321)',
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: '3px solid #FFD700'
              }}>
                <div style={{ fontSize: '8em', marginBottom: '20px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>🧔</div>
                <h2 style={{ margin: '0 0 10px 0', fontSize: '1.8em', textAlign: 'center' }}>Tio Bento</h2>
                <p style={{ fontSize: '1em', fontStyle: 'italic', opacity: 0.9, textAlign: 'center', marginBottom: '20px' }}>"Bem-vindo à minha loja, aventureiro!"</p>
                <div style={{ 
                  background: 'rgba(0,0,0,0.3)',
                  padding: '15px 25px',
                  borderRadius: '10px',
                  border: '2px solid #FFD700',
                  fontSize: '1.3em',
                  fontWeight: 'bold',
                  color: '#FFD700',
                  textAlign: 'center'
                }}>
                  🌽 {player.sabugos || 0} Sabugos
                </div>
              </div>

              {/* Lado Direito - Itens */}
              <div style={{ 
                width: '65%',
                background: 'linear-gradient(135deg, #8B4513, #654321)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                  borderRadius: '15px',
                  border: '4px solid #FFD700',
                  boxShadow: 'inset 0 4px 15px rgba(0, 0, 0, 0.6), inset 0 -4px 15px rgba(0, 0, 0, 0.4)',
                  padding: '25px',
                  overflowY: 'auto',
                  maxHeight: '540px'
                }}
                className="shop-items-scroll"
                >
                  <style>{`
                    .shop-items-scroll::-webkit-scrollbar {
                      width: 12px;
                    }
                    .shop-items-scroll::-webkit-scrollbar-track {
                      background: rgba(139, 69, 19, 0.3);
                      border-radius: 10px;
                    }
                    .shop-items-scroll::-webkit-scrollbar-thumb {
                      background: linear-gradient(135deg, #8B4513, #654321);
                      border-radius: 10px;
                      border: 2px solid #FFD700;
                    }
                    .shop-items-scroll::-webkit-scrollbar-thumb:hover {
                      background: linear-gradient(135deg, #654321, #8B4513);
                    }
                  `}</style>
                  <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.5em', borderBottom: '2px solid rgba(255,255,255,0.2)', paddingBottom: '10px' }}>🛍️ Itens Disponíveis</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {/* Poção de Vida */}
                  <div style={{ 
                    background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(211, 47, 47, 0.2))',
                    padding: '15px',
                    borderRadius: '12px',
                    border: '2px solid rgba(244, 67, 54, 0.5)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '1.5em', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>❤️</span>
                        <span>Poção de Vida</span>
                      </div>
                      <div style={{ opacity: 0.8, fontSize: '0.9em' }}>Restaura 50% do HP máximo</div>
                    </div>
                    <button 
                      onClick={() => {
                        const cost = 10;
                        if (player.sabugos >= cost) {
                          const bonus = getTotalStats();
                          const healAmount = Math.floor((player.maxHp + bonus.maxHp) * 0.5);
                          setPlayer(prev => ({ 
                            ...prev, 
                            hp: Math.min(prev.hp + healAmount, prev.maxHp + bonus.maxHp),
                            sabugos: prev.sabugos - cost
                          }));
                          addLog(`❤️ Comprou Poção de Vida! +${healAmount} HP`);
                        } else {
                          addLog('🚫 Sabugos insuficientes!');
                        }
                      }}
                      style={{
                        background: player.sabugos >= 10 ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'linear-gradient(135deg, #555, #333)',
                        border: '2px solid ' + (player.sabugos >= 10 ? '#FFD700' : '#666'),
                        color: player.sabugos >= 10 ? '#000' : '#999',
                        padding: '12px 25px',
                        borderRadius: '10px',
                        cursor: player.sabugos >= 10 ? 'pointer' : 'not-allowed',
                        fontSize: '1.1em',
                        fontWeight: 'bold',
                        minWidth: '120px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { if (player.sabugos >= 10) e.currentTarget.style.transform = 'scale(1.1)'; }}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      🌽 10
                    </button>
                  </div>

                  {/* Poção de Mana */}
                  <div style={{ 
                    background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.2), rgba(25, 118, 210, 0.2))',
                    padding: '15px',
                    borderRadius: '12px',
                    border: '2px solid rgba(33, 150, 243, 0.5)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '1.5em', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>🔮</span>
                        <span>Poção de Mana</span>
                      </div>
                      <div style={{ opacity: 0.8, fontSize: '0.9em' }}>Restaura 50% da Mana máxima</div>
                    </div>
                    <button 
                      onClick={() => {
                        const cost = 10;
                        if (player.sabugos >= cost) {
                          const healAmount = Math.floor(maxMana * 0.5);
                          setMana(prev => Math.min(prev + healAmount, maxMana));
                          setPlayer(prev => ({ ...prev, sabugos: prev.sabugos - cost }));
                          addLog(`🔮 Comprou Poção de Mana! +${healAmount} Mana`);
                        } else {
                          addLog('🚫 Sabugos insuficientes!');
                        }
                      }}
                      style={{
                        background: player.sabugos >= 10 ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'linear-gradient(135deg, #555, #333)',
                        border: '2px solid ' + (player.sabugos >= 10 ? '#FFD700' : '#666'),
                        color: player.sabugos >= 10 ? '#000' : '#999',
                        padding: '12px 25px',
                        borderRadius: '10px',
                        cursor: player.sabugos >= 10 ? 'pointer' : 'not-allowed',
                        fontSize: '1.1em',
                        fontWeight: 'bold',
                        minWidth: '120px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { if (player.sabugos >= 10) e.currentTarget.style.transform = 'scale(1.1)'; }}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      🌽 10
                    </button>
                  </div>

                  {/* Poção de XP x2 */}
                  <div style={{ 
                    background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.2), rgba(123, 31, 162, 0.2))',
                    padding: '15px',
                    borderRadius: '12px',
                    border: '2px solid rgba(156, 39, 176, 0.5)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '1.5em', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>⭐</span>
                        <span>Poção de XP x2</span>
                      </div>
                      <div style={{ opacity: 0.8, fontSize: '0.9em' }}>Dobra XP por 10 lutas</div>
                    </div>
                    <button 
                      onClick={() => {
                        const cost = 50;
                        if (player.sabugos >= cost) {
                          setPlayer(prev => ({ ...prev, sabugos: prev.sabugos - cost, xpBoost: 2, xpBoostRounds: 10 }));
                          addLog(`⭐ Comprou Poção de XP x2! Próximas 10 lutas`);
                        } else {
                          addLog('🚫 Sabugos insuficientes!');
                        }
                      }}
                      style={{
                        background: player.sabugos >= 50 ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'linear-gradient(135deg, #555, #333)',
                        border: '2px solid ' + (player.sabugos >= 50 ? '#FFD700' : '#666'),
                        color: player.sabugos >= 50 ? '#000' : '#999',
                        padding: '12px 25px',
                        borderRadius: '10px',
                        cursor: player.sabugos >= 50 ? 'pointer' : 'not-allowed',
                        fontSize: '1.1em',
                        fontWeight: 'bold',
                        minWidth: '120px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { if (player.sabugos >= 50) e.currentTarget.style.transform = 'scale(1.1)'; }}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      🌽 50
                    </button>
                  </div>

                  {/* Poção de XP x5 */}
                  <div style={{ 
                    background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.2), rgba(245, 124, 0, 0.2))',
                    padding: '15px',
                    borderRadius: '12px',
                    border: '2px solid rgba(255, 152, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '1.5em', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>🌟</span>
                        <span>Poção de XP x5</span>
                      </div>
                      <div style={{ opacity: 0.8, fontSize: '0.9em' }}>Quintuplica XP por 10 lutas</div>
                    </div>
                    <button 
                      onClick={() => {
                        const cost = 150;
                        if (player.sabugos >= cost) {
                          setPlayer(prev => ({ ...prev, sabugos: prev.sabugos - cost, xpBoost: 5, xpBoostRounds: 10 }));
                          addLog(`🌟 Comprou Poção de XP x5! Próximas 10 lutas`);
                        } else {
                          addLog('🚫 Sabugos insuficientes!');
                        }
                      }}
                      style={{
                        background: player.sabugos >= 150 ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'linear-gradient(135deg, #555, #333)',
                        border: '2px solid ' + (player.sabugos >= 150 ? '#FFD700' : '#666'),
                        color: player.sabugos >= 150 ? '#000' : '#999',
                        padding: '12px 25px',
                        borderRadius: '10px',
                        cursor: player.sabugos >= 150 ? 'pointer' : 'not-allowed',
                        fontSize: '1.1em',
                        fontWeight: 'bold',
                        minWidth: '120px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { if (player.sabugos >= 150) e.currentTarget.style.transform = 'scale(1.1)'; }}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      🌽 150
                    </button>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="player-sidebar">
        <div className="player-stats">
          <div className="player-avatar" style={{ background: getPlayerColor().bg, borderColor: getPlayerColor().border }}>
            {characterIcon}
          </div>
          <h2>{characterName} - Nv.{player.level}</h2>
          <div className="hp-bar">
            <div className="hp-fill" style={{ width: `${(player.hp / (player.maxHp + getTotalStats().maxHp)) * 100}%` }}></div>
            <span>{player.hp} / {player.maxHp + getTotalStats().maxHp} HP</span>
          </div>
          <div className="xp-bar">
            <div className="xp-fill" style={{ width: `${(player.xp / player.xpToNext) * 100}%` }}></div>
            <span>{player.xp} / {player.xpToNext} XP</span>
          </div>
          <div className="hp-bar" style={{ marginTop: '10px' }}>
            <div className="xp-fill" style={{ width: `${(mana / maxMana) * 100}%`, background: 'linear-gradient(90deg, #4444ff, #6666ff)' }}></div>
            <span>{mana} / {maxMana} Mana</span>
          </div>
          <div className="stats">
            <span title="Aumenta o dano base dos ataques">💪 Força: {player.strength + getTotalStats().strength}</span>
            <span title="Aumenta chance de crítico (x2 dano)">⚡ Agilidade: {player.agility + getTotalStats().agility}</span>
            <span title="Aumenta dano de magias">🧠 Inteligência: {player.intelligence + getTotalStats().intelligence}</span>
            <span title="Regenera HP e Mana">❤️ Vitalidade: {player.vitality}</span>
            <span>💀 Abates: {player.kills}</span>
            <span>🌽 Sabugos: {player.sabugos || 0}</span>
          </div>
        </div>

        <div className="sidebar-buttons">
          <button className="btn-sidebar" onClick={() => setShowInventory(true)}>
            🎒 Inventário [I] {inventory.length > 0 && `(${inventory.length})`}
          </button>

          <button className="btn-sidebar" onClick={() => setShowSpellbook(true)}>
            📚 Magias [M]
          </button>

          <button className="btn-sidebar" onClick={saveGame}>
            💾 Salvar [S]
          </button>

          <button className="btn-sidebar btn-reset" onClick={resetGame}>
            🚪 Sair
          </button>
        </div>

        <div className="spells">
          <h3>Magias</h3>
          {getEquippedSpells().map(spell => (
            <button 
              key={spell.id}
              className="spell-btn"
              onClick={() => castSpell(spell)}
              disabled={mana < spell.cost || !combat || !enemy || enemy.hp <= 0 || spell.unlockLevel > player.level}
              title={`Custo: ${spell.cost} mana`}
            >
              {spell.icon} {spell.name} [{spell.key}]
            </button>
          ))}
        </div>
      </div>

      <div className="main-content">
        <div className="actions">
          {!combat && levelUpPoints === 0 ? (
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={startCombat} className="btn-primary" style={(player.bossCounter + 1) % 10 === 0 ? { background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#000', fontWeight: 'bold', fontSize: '1.3em' } : {}}>
                {(player.bossCounter + 1) % 10 === 0 ? '👑 ENFRENTAR O BOSS [B]' : 'Buscar Inimigo [B]'}
              </button>
              {(player.bossCounter + 1) % 10 === 0 && (
                <button onClick={escapeBoss} className="btn-primary" style={{ background: 'linear-gradient(135deg, #f44336, #d32f2f)' }}>
                  🏃 ESCAPAR
                </button>
              )}
            </div>
          ) : levelUpPoints === 0 ? (
            <button onClick={playerAttack} className="btn-attack" disabled={enemy?.hp <= 0}>
              Sabugar [{nextAttackKey === 'ArrowLeft' ? '←' : '→'}]
            </button>
          ) : null}
        </div>

        {enemy ? (
          <div className="enemy-stats">
            <div className="enemy-avatar">
              👹
              {floatingText && (
                <div className={`floating-text ${floatingText.type}`}>
                  {floatingText.text}
                </div>
              )}
            </div>
            <h2>{enemy.name} {enemy.isFast ? '⚡' : '🐢'}</h2>
            {(enemyEffects.slow || enemyEffects.stun || enemyEffects.shock || enemyEffects.poison) && (
              <div className="enemy-effects">
                {enemyEffects.slow && <span className="effect-badge">❄️ Lento</span>}
                {enemyEffects.stun && <span className="effect-badge">⚡ Paralisado</span>}
                {enemyEffects.shock && <span className="effect-badge">⚡ Eletrificado</span>}
                {enemyEffects.poison && <span className="effect-badge">🧪 Envenenado</span>}
              </div>
            )}
            <div className="hp-bar enemy">
              <div className="hp-fill" style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}></div>
              <span>{enemy.hp} / {enemy.maxHp} HP</span>
            </div>
            {combat && (
              <div className="attack-timer">
                <div className="timer-fill" style={{ width: `${(attackTimer / enemy.attackSpeed) * 100}%` }}></div>
                <span>Próximo ataque: {(attackTimer / 1000).toFixed(1)}s</span>
              </div>
            )}
            <div className="stats">
              <span>💪 {enemy.strength}</span>
              <span>⚡ {enemy.agility}</span>
              <span>🧠 {enemy.intelligence}</span>
              <span>⏱️ {(enemy.attackSpeed / 1000).toFixed(1)}s</span>
            </div>
          </div>
        ) : (
          <div className="enemy-stats" style={{ opacity: 0.3 }}>
            <div className="enemy-avatar">
              ❓
            </div>
            <h2>Nenhum inimigo</h2>
            <p style={{ textAlign: 'center', marginTop: '20px' }}>Clique em "Buscar Inimigo" para começar</p>
          </div>
        )}

        <div className="log">
          <h3>Log de Combate</h3>
          {log.map((msg, i) => (
            <div key={i} className="log-entry">{msg}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
