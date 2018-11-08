BEGIN TRANSACTION 

update dosya set TurID=null 
from dosya D 
where TurID is not null


declare @Makine Table (MakineID int,MakineSeriNo nvarchar(60),ServisAdedi int,Periyod int,bayiID int)
declare @MakineID int,@isBitti bit,@KapanisTarihi smalldatetime, @MusteriID int=1323,@SirketID int =100000001,@UserAlias nvarchar(5)=N'27565'

insert into @Makine
select FMA.MakineID "MakineID" ,Makine.SeriNo "Seri No",count(FMA.DosyaID) "Servis Adedi",3 "Periyod",Makine.BayiID "Son Kullanýcý" from P_DosyaView Dosya
inner join DosyaMakineAssignment FMA with(nolock) on FMA.DosyaID=Dosya.DosyaID
left join P_makineview Makine with(nolock) on Makine.MakineID=FMA.MakineID
where Dosya.DosyaTipID=7--servis
and isnull(Dosya.iptaledildi,0)=0--iptal edilmeyenler
and isnull(Dosya.kaybedildi,0)=0--kaybedilmeyenler
 and  (Dosya.baslangicTarihi between  dateadd(month,-3,getdate()) and getdate())
 group by FMA.MakineID,Makine.SeriNo,Makine.BayiID
having count(FMA.DosyaID) >=2  /* Bir makineye son 3 ayda açýlan 2 ve üzeri servis fiþ sayýsýný bulduran koddur*/
union all
  select FMA.MakineID "MakineID" ,Makine.SeriNo "Seri No",count(FMA.DosyaID) "Servis Adedi",6 "Periyod",Makine.BayiID "Son Kullanýcý" from P_DosyaView Dosya
inner join DosyaMakineAssignment FMA with(nolock) on FMA.DosyaID=Dosya.DosyaID
left join P_makineview Makine with(nolock) on Makine.MakineID=FMA.MakineID
where Dosya.DosyaTipID=7--ön Dosya
and isnull(Dosya.iptaledildi,0)=0--iptal edilmeyenler
and isnull(Dosya.kaybedildi,0)=0--kaybedilmeyenler
 and  (Dosya.baslangicTarihi between dateadd(month,-6,getdate()) and getdate())--6 ayda 3 ve üzeri
group by FMA.MakineID,Makine.SeriNo,Makine.BayiID
having count(FMA.DosyaID) >=3
union all
  select FMA.MakineID "MakineID" ,Makine.SeriNo "Seri No",count(FMA.DosyaID) "Servis Adedi" ,12 "Periyod",Makine.BayiID "Son Kullanýcý" from P_DosyaView Dosya
inner join DosyaMakineAssignment FMA with(nolock) on FMA.DosyaID=Dosya.DosyaID
left join P_makineview Makine with(nolock) on Makine.MakineID=FMA.MakineID
where Dosya.DosyaTipID=7--ön Dosya
and isnull(Dosya.iptaledildi,0)=0--iptal edilmeyenler
and isnull(Dosya.kaybedildi,0)=0--kaybedilmeyenler
 and  (Dosya.baslangicTarihi between  dateadd(month,-12,getdate()) and getdate())--12 ayda 6 ve üzeri
group by FMA.MakineID,Makine.SeriNo,Makine.BayiID
having count(FMA.DosyaID) >=6
order by FMA.MakineID
 
 
delete @Makine
from @Makine M
inner join
(
    select MakineID,count(*) Adet,max(Periyod) Periyod
    from @Makine
    group by MakineID having count(*) >1
 
) A on M.MakineID=A.MakineID and M.Periyod=A.Periyod
 
 
delete @Makine
from @Makine M
inner join
(
    select MakineID,count(*) Adet,max(Periyod) Periyod
    from @Makine
    group by MakineID having count(*) >1
 
) A on M.MakineID=A.MakineID and M.Periyod=A.Periyod
 
--select * from @makine order by makineID


PRINT N'SORUN TABLOSU AÇILACAK MAKÝNELER BELÝRLENDÝ'


DECLARE MAKÝNE_DÝZÝ CURSOR FOR
SELECT makineID FROM @makine order by makineID

OPEN MAKÝNE_DÝZÝ

FETCH NEXT FROM MAKÝNE_DÝZÝ INTO @MakineID

WHILE @@FETCH_STATUS =0
BEGIN
	BEGIN TRY  
		if exists (select * 
					from P_DosyaView sorunfisi with (nolock)
					inner join DosyaMakineAssignment FMA with(nolock) on FMA.DosyaID=sorunfisi.DosyaID
					--inner join P_makineview Makine with(nolock) on Makine.MakineID=FMA.MakineID
					where  FMA.MakineID=@MakineID and isnull(sorunfisi.dosyaTipID,0)=143 and isnull(Sorunfisi.iptaledildi,0)=0
					and (SorunFisi.baslangicTarihi between  dateadd(month,-3,getdate()) and getdate())
				   )--Bir makineye son 3 ayda sorun fiþi açýldý mý?
		begin
				PRINT N'SON 3 AYDA SORUN FÝÞÝ AÇILMIÞ'
							 
				select  top 1 @isBitti=isnull(isbitti,0),
				@KapanisTarihi=isBittiTarihi
				from P_DosyaView sorunfisi with(nolock) 
				inner join DosyaMakineAssignment FMA with(nolock) on FMA.DosyaID=sorunfisi.DosyaID
				inner join P_makineview Makine with(nolock) on Makine.MakineID=FMA.MakineID
				where FMA.MakineID=@MakineID 
				and isnull(sorunfisi.DosyaTipID,0)=143 
				and isnull(Sorunfisi.iptaledildi,0)=0 
				and (SorunFisi.baslangicTarihi between  dateadd(month,-3,getdate()) and getdate())--Bir makineye son 3 ayda açýlan bir sorun fiþi varsa eðer açýk mý kapalý mý?
				order by sorunfisi.eventdate desc

				if @isBitti=1 --sorun fiþi kapalý ise kapandýktan sonra son 3 ay içinde servis fiþi açýldý mý?Evet ise sorun fiþi aç
				begin
					PRINT N'SORUN FÝÞÝ AÇILMIÞ AMA ÝÞ BÝTTÝ YAPILMIÞ'
					if exists(select count(FMA.DosyaID) "Servis Adedi",Makine.SeriNo "Seri No" 
											 from P_DosyaView Dosya with(nolock) 
											 inner join DosyaMakineAssignment FMA with(nolock) on FMA.DosyaID=Dosya.DosyaID
											 inner join P_makineview Makine with(nolock) on Makine.MakineID=FMA.MakineID
											 where Dosya.DosyaTipID=7--ön Dosya
											 and isnull(Dosya.iptaledildi,0)=0--iptal edilmeyenler
											 and isnull(Dosya.kaybedildi,0)=0--kaybedilmeyenler
											 and Dosya.baslangicTarihi > @KapanisTarihi 
											 and FMA.MakineID=@MakineID
										group by Makine.SeriNo)
					begin
						PRINT 'SORUN FÝÞÝ AÇILMIÞ AMA ÝÞ BÝTTÝ YAPILMIÞ YÝNE AÇILDI'
						insert Dosya ([DosyaTipID],[CariID],[DosyaAd],[OperasyonID],[LinkType],[LinkID],[BaslangicTarihi],[Aciklama],MusteriID,SirketID,UserAlias,UpdateUserAlias,EventDate,UpdateDate,TurID)
						select  143,bayiID,'Sorun Fiþi',null,'makine',makineID,getdate(),'Sorun Fiþi',@MusteriID,@SirketID,@UserAlias,@UserAlias,getdate(),getdate(),makineID
						from @Makine where makineID=@MakineID

						insert DosyaMakineAssignment(MusteriID,SirketID,DosyaID,MakineID)
						select dosya.MusteriID,Dosya.SirketID,Dosya.DosyaID,Dosya.TurID 
						from P_DosyaView dosya with(nolock) 
						where dosya.TurID=@MakineID

						
					end
				end
		end
		else--Bir makineye son 3 ayda sorun fiþi açýlmadý ise aç
		begin
				 PRINT 'SON 3 AYDA SORUN FÝÞÝ YOKSA EÐER  FÝÞ AÇILDI'
				 insert Dosya ([DosyaTipID],[CariID],[DosyaAd],[OperasyonID],[LinkType],[LinkID],[BaslangicTarihi],[Aciklama],MusteriID,SirketID,UserAlias,UpdateUserAlias,EventDate,UpdateDate,TurID)
				 select  143,bayiID,'Sorun Fiþi',null,'makine',makineID,getdate(),'Sorun Fiþi',@MusteriID,@SirketID,@UserAlias,@UserAlias,getdate(),getdate(),makineID
				 from @Makine where makineID=@MakineID
	        
				 insert DosyaMakineAssignment(MusteriID,SirketID,DosyaID,MakineID)
				 select dosya.MusteriID,Dosya.SirketID,Dosya.DosyaID,Dosya.TurID 
				 from P_DosyaView dosya with(nolock)  where dosya.TurID=@MakineID

				 
		end
	END TRY
	BEGIN CATCH  
			select ERROR_NUMBER() AS ErrorNumber ,ERROR_MESSAGE() AS ErrorMessage,MakineID,SeriNo
			from makine with (nolock)
			where MakineID=@MakineID
			  
	END CATCH;   	
	FETCH NEXT FROM MAKÝNE_DÝZÝ INTO @MakineID
 
END

CLOSE MAKÝNE_DÝZÝ
DEALLOCATE MAKÝNE_DÝZÝ

update dosya set TurID=null 
from dosya D 
where TurID is not null




rollback transaction




























